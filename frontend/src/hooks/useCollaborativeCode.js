import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CODE_CHANGE_EVENT = "evalo_code_change";
const CODE_REQUEST_EVENT = "evalo_code_request";
const CODE_SNAPSHOT_EVENT = "evalo_code_snapshot";
const LANGUAGE_CHANGE_EVENT = "evalo_language_change";
const CURSOR_CHANGE_EVENT = "evalo_cursor_change";

const SYNC_DEBOUNCE_MS = 120;
const CURSOR_THROTTLE_MS = 80;
const REQUEST_SNAPSHOT_DELAY_MS = 250;
const REMOTE_CURSOR_TTL_MS = 15000;

const createClientId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    return `client_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const getStarterCode = (starterCodeByLanguage, language) => starterCodeByLanguage?.[language] || "";

function useCollaborativeCode({
    channel,
    defaultLanguage = "javascript",
    documentId,
    starterCodeByLanguage,
    userId,
    userName = "User",
}) {
    const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage);
    const [editorCode, setEditorCode] = useState("");
    const [remoteCursors, setRemoteCursors] = useState([]);

    const clientIdRef = useRef(createClientId());
    const codeRef = useRef("");
    const languageRef = useRef(defaultLanguage);
    const syncTimerRef = useRef(null);
    const cursorTimerRef = useRef(null);
    const pendingCursorRef = useRef(null);
    const versionRef = useRef(0);
    const latestRemoteSentAtRef = useRef(0);
    const documentIdRef = useRef(documentId);
    const remoteCursorMapRef = useRef(new Map());

    const collaborationEvents = useMemo(
        () => new Set([CODE_CHANGE_EVENT, CODE_REQUEST_EVENT, CODE_SNAPSHOT_EVENT, LANGUAGE_CHANGE_EVENT, CURSOR_CHANGE_EVENT]),
        []
    );

    const publishRemoteCursors = useCallback(() => {
        setRemoteCursors(Array.from(remoteCursorMapRef.current.values()));
    }, []);

    const applyCode = useCallback((nextCode) => {
        const normalizedCode = nextCode || "";
        codeRef.current = normalizedCode;
        setEditorCode(normalizedCode);
    }, []);

    const sendSnapshot = useCallback(
        async (type, overrides = {}) => {
            if (!channel || !userId) return;

            try {
                await channel.sendEvent({
                    type,
                    clientId: clientIdRef.current,
                    code: overrides.code ?? codeRef.current,
                    cursor: pendingCursorRef.current,
                    language: overrides.language ?? languageRef.current,
                    name: userName,
                    senderId: userId,
                    sentAt: Date.now(),
                    version: ++versionRef.current,
                });
            } catch (error) {
                console.warn("[code-sync] Unable to send editor sync event:", error.message);
            }
        },
        [channel, userId, userName]
    );

    const sendCursorSnapshot = useCallback(
        async (cursor) => {
            if (!channel || !userId) return;

            try {
                await channel.sendEvent({
                    type: CURSOR_CHANGE_EVENT,
                    active: Boolean(cursor),
                    clientId: clientIdRef.current,
                    cursor,
                    language: languageRef.current,
                    name: userName,
                    senderId: userId,
                    sentAt: Date.now(),
                });
            } catch (error) {
                console.warn("[code-sync] Unable to send cursor sync event:", error.message);
            }
        },
        [channel, userId, userName]
    );

    const flushCursorChange = useCallback(() => {
        cursorTimerRef.current = null;
        sendCursorSnapshot(pendingCursorRef.current);
    }, [sendCursorSnapshot]);

    const handleCursorChange = useCallback(
        (cursor) => {
            pendingCursorRef.current = cursor;

            if (!cursor) {
                if (cursorTimerRef.current) {
                    window.clearTimeout(cursorTimerRef.current);
                    cursorTimerRef.current = null;
                }

                sendCursorSnapshot(null);
                return;
            }

            if (!channel || !userId || cursorTimerRef.current) return;

            cursorTimerRef.current = window.setTimeout(flushCursorChange, CURSOR_THROTTLE_MS);
        },
        [channel, flushCursorChange, sendCursorSnapshot, userId]
    );

    const flushCodeChange = useCallback(() => {
        syncTimerRef.current = null;
        sendSnapshot(CODE_CHANGE_EVENT);
    }, [sendSnapshot]);

    const scheduleCodeChange = useCallback(() => {
        if (!channel || !userId) return;

        if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
        syncTimerRef.current = window.setTimeout(flushCodeChange, SYNC_DEBOUNCE_MS);
    }, [channel, flushCodeChange, userId]);

    const handleCodeChange = useCallback(
        (nextCode) => {
            codeRef.current = nextCode || "";
            scheduleCodeChange();
        },
        [scheduleCodeChange]
    );

    const changeLanguage = useCallback(
        (nextLanguage) => {
            const nextCode = getStarterCode(starterCodeByLanguage, nextLanguage);

            if (syncTimerRef.current) {
                window.clearTimeout(syncTimerRef.current);
                syncTimerRef.current = null;
            }

            languageRef.current = nextLanguage;
            setSelectedLanguage(nextLanguage);
            applyCode(nextCode);
            sendSnapshot(LANGUAGE_CHANGE_EVENT, { code: nextCode, language: nextLanguage });
        },
        [applyCode, sendSnapshot, starterCodeByLanguage]
    );

    const resetCode = useCallback(() => {
        const nextCode = getStarterCode(starterCodeByLanguage, languageRef.current);
        applyCode(nextCode);
        sendSnapshot(CODE_CHANGE_EVENT, { code: nextCode, language: languageRef.current });
    }, [applyCode, sendSnapshot, starterCodeByLanguage]);

    useEffect(() => {
        if (!starterCodeByLanguage) return;

        const shouldResetDocument = documentIdRef.current !== documentId;
        const hasNoCode = codeRef.current === "";

        if (shouldResetDocument) {
            documentIdRef.current = documentId;
            languageRef.current = defaultLanguage;
            setSelectedLanguage(defaultLanguage);
            remoteCursorMapRef.current.clear();
            publishRemoteCursors();
        }

        if (shouldResetDocument || hasNoCode) {
            applyCode(getStarterCode(starterCodeByLanguage, languageRef.current));
        }
    }, [applyCode, defaultLanguage, documentId, publishRemoteCursors, starterCodeByLanguage]);

    useEffect(() => {
        if (!channel || !userId) return;

        const syncRemoteCursorFromEvent = (event, { removeWhenInactive = false } = {}) => {
            const cursorId = event.senderId || event.user?.id || event.clientId;
            if (!cursorId) return;

            if (event.active === false || !event.cursor) {
                if (removeWhenInactive) {
                    remoteCursorMapRef.current.delete(cursorId);
                    publishRemoteCursors();
                }
                return;
            }

            remoteCursorMapRef.current.set(cursorId, {
                id: cursorId,
                language: event.language || languageRef.current,
                name: event.name || event.user?.name || "Participant",
                position: event.cursor.position,
                selection: event.cursor.selection,
                updatedAt: Number(event.sentAt) || Date.now(),
            });
            publishRemoteCursors();
        };

        const subscription = channel.on((event) => {
            if (!collaborationEvents.has(event.type)) return;
            if (event.clientId === clientIdRef.current || event.senderId === userId || event.user?.id === userId) return;

            if (event.type === CURSOR_CHANGE_EVENT) {
                syncRemoteCursorFromEvent(event, { removeWhenInactive: true });
                return;
            }

            if (event.type === CODE_REQUEST_EVENT) {
                sendSnapshot(CODE_SNAPSHOT_EVENT);
                return;
            }

            syncRemoteCursorFromEvent(event);

            const sentAt = Number(event.sentAt) || Date.now();
            if (sentAt < latestRemoteSentAtRef.current) return;
            latestRemoteSentAtRef.current = sentAt;

            const nextLanguage = event.language || languageRef.current;
            const nextCode = typeof event.code === "string" ? event.code : codeRef.current;

            languageRef.current = nextLanguage;
            setSelectedLanguage(nextLanguage);
            applyCode(nextCode);
        });

        const requestTimer = window.setTimeout(() => {
            sendSnapshot(CODE_REQUEST_EVENT);
        }, REQUEST_SNAPSHOT_DELAY_MS);

        return () => {
            window.clearTimeout(requestTimer);
            subscription.unsubscribe();
        };
    }, [applyCode, channel, collaborationEvents, publishRemoteCursors, sendSnapshot, userId]);

    useEffect(() => {
        const staleCursorInterval = window.setInterval(() => {
            const now = Date.now();
            let removedCursor = false;

            remoteCursorMapRef.current.forEach((cursor, cursorId) => {
                if (now - cursor.updatedAt > REMOTE_CURSOR_TTL_MS) {
                    remoteCursorMapRef.current.delete(cursorId);
                    removedCursor = true;
                }
            });

            if (removedCursor) publishRemoteCursors();
        }, 5000);

        return () => window.clearInterval(staleCursorInterval);
    }, [publishRemoteCursors]);

    useEffect(() => {
        return () => {
            if (syncTimerRef.current) window.clearTimeout(syncTimerRef.current);
            if (cursorTimerRef.current) window.clearTimeout(cursorTimerRef.current);
            sendCursorSnapshot(null);
        };
    }, [sendCursorSnapshot]);

    return {
        code: editorCode,
        codeRef,
        handleCodeChange,
        handleCursorChange,
        remoteCursors,
        changeLanguage,
        resetCode,
        selectedLanguage,
    };
}

export default useCollaborativeCode;
