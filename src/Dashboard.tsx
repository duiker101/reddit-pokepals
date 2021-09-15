import React, {useEffect, useMemo, useState} from "react";
import {getSubreddit, Sort} from "./api/RedditAPI";
import styled from "styled-components";
import {down, up} from "styled-breakpoints";
import Code from "./Code";
import {SelectPicker} from "rsuite";

export type Post = {
    selftext: string;
    title: string;
    author: string;
    author_flair_text: string;
    url: string;
    created_utc: number;
};

const Wrapper = styled.div`
    max-width: 1000px;
    margin: auto auto;
    padding: 1em;
`;

const Tiles = styled.div`
    display: grid;
    grid-gap: 1em;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

    ${down("xs")} {
        grid-template-columns: 1fr;
    }

    ${up("md")} {
        grid-gap: 2em;
    }
`;

const Header = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    margin-bottom: 1em;
    align-items: center;
`;

const Links = styled.div`
    text-align: right;
`;

const Title = styled.div`
    text-align: center;
    font-weight: 700;
    font-size: 1.4em;
`;

function Dashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [sort, setSort] = useState<Sort>("new");

    useEffect(() => {
        getSubreddit(sort).then((r) => {
            setPosts(r.data.data.children.map((p: any) => p.data as Post));
        });
    }, [sort]);

    const codes = useMemo(
        () =>
            posts.reduce((a, c) => {
                const matches = [
                    ...c.selftext.matchAll(/(\d{4}\s?\d{4}\s?\d{4})/g),
                    ...c.title.matchAll(/(\d{4}\s?\d{4}\s?\d{4})/g),
                ];
                for (let match of matches) {
                    const code = match[0].replace(/\s/g, "");
                    a[code] = c;
                }
                return a;
            }, {} as {[key: string]: Post}),
        [posts]
    );

    return (
        <Wrapper>
            <Header>
                <SelectPicker
                    searchable={false}
                    cleanable={false}
                    data={[
                        {label: "New", value: "new"},
                        {label: "Hot", value: "hot"},
                    ]}
                    value={sort}
                    onChange={(v) => setSort(v)}
                    appearance="subtle"
                    placeholder="Sort"
                    style={{width: 100}}
                />
                <Title>PokePals</Title>
                <Links>
                    <a href={"https://github.com/duiker101/reddit-pokepals"}>
                        GitHub
                    </a>
                </Links>
            </Header>
            <Tiles>
                {Object.entries(codes).map(([code, post]) => (
                    <Code post={post} code={code} key={code}>
                        {code}
                    </Code>
                ))}
            </Tiles>
        </Wrapper>
    );
}

export default Dashboard;
