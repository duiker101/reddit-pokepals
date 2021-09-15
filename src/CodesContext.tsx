import React, {PropsWithChildren, useEffect, useState} from "react";
import localforage from "localforage";

function createCtx<A>() {
    const ctx = React.createContext<A | undefined>(undefined);

    function useCtx() {
        const c = React.useContext(ctx);
        if (!c)
            throw new Error("useCtx must be inside a Provider with a value");
        return c;
    }

    return [useCtx, ctx.Provider] as const;
}

interface ContextState {
    visited: string[];

    setVisited(visited: string[]): void;
}

function useContextHook(): ContextState {
    const [visited, setVisited] = useState<string[]>([]);
    useEffect(() => {
        localforage.getItem("visited").then((v) => v && setVisited(v as any));
    }, []);
    useEffect(() => {
        localforage.setItem("visited", visited);
    }, [visited]);

    return {
        visited,
        setVisited,
    };
}

const [useVisited, Provider] = createCtx<ContextState>();

export const VisitedWrapper = (props: PropsWithChildren<{}>) => {
    const hook = useContextHook();
    return <Provider value={hook}>{props.children}</Provider>;
};

export {useVisited};
