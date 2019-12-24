import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Post} from "./Dashboard";
import QRCode from "qrcode";
import {down, only} from "styled-breakpoints";
import * as _ from "lodash";
import {useVisited} from "./CodesContext";
import moment from "moment";
import copy from "copy-to-clipboard";
import copyImg from "./copy.svg";
import {Alert} from "rsuite";

const Wrapper = styled.div<{visited: boolean; border: string | null}>`
    display: grid;
    grid-template-rows: auto 1fr;
    padding: 10px;
    border-radius: 0.4em;
    box-shadow: 1px 1px 10px
        ${p => (p.border ? p.border : `rgba(0, 0, 0, 0.05)`)};
    border: 1px solid rgba(0, 0, 0, 0.05);
    background: white;
    ${p => p.visited && `opacity:.5`}
    ${down("xs")} {
        grid-template-columns: 1fr 50px;
    }
`;

const QRImage = styled.img`
    width: 90%;
    margin: auto auto;
    cursor: pointer;

    ${only("xs")} {
        display: none;
    }
`;

const Title = styled.div`
    font-weight: 700;
    margin-bottom: 0.5em;
    color: #222;
    cursor: pointer;
`;

const Details = styled.div`
    color: #888;
`;

const Posted = styled.span`
    color: #444;
    font-weight: 500;
`;

const CopyImg = styled.img`
    color: #888;
    cursor: pointer;
    width: 30px;
    margin: auto;
    opacity: 0.6;
    display: none;
    ${only("xs")} {
        display: block;
    }
`;

const Author = styled.span``;

const Code: React.FC<Props> = props => {
    const {post, code} = props;
    const [image, setImage] = useState<string | null>(null);
    const {visited, setVisited} = useVisited();
    const prettyCode =
        code.slice(0, 4) + " " + code.slice(4, 8) + " " + code.slice(8, 12);

    useEffect(() => {
        QRCode.toDataURL(code).then(url => {
            setImage(url);
        });
    }, [code]);

    const datePosted = moment(post.created_utc * 1000);
    const msDiff = moment.utc().diff(datePosted);
    const timeDiff =
        msDiff > 60 * 60 * 1000
            ? moment.utc().diff(datePosted, "hour") + " hours"
            : moment.utc().diff(datePosted, "minute") + " minutes";

    const copyCode = () => {
        copy(code);
        setVisited(_.uniq([...visited, code]));
        Alert.info("Code copied!", 1000);
    };

    const openPost = () => {
        window.open(post.url, "_blank");
    };

    const team = post.author_flair_text.match(/Team (\w+)/);
    const teamColors = {
        valor: "rgba(255,0,0,0.4)",
        mystic: "rgba(0,0,255,0.4)",
        instinct: "rgba(255,255,0,0.4)",
    };
    let teamColor = null;

    if (!!team) teamColor = teamColors[team[1].toLowerCase()];

    const playerName = post.author_flair_text.match(/- ([a-zA-Z\d]+)$/);

    return (
        <Wrapper visited={visited.includes(code)} border={teamColor}>
            {image && <QRImage onClick={copyCode} src={image} />}
            <Details>
                <Title onClick={openPost}>{post.title}</Title>
                Posted <Posted>{timeDiff}</Posted> ago by{" "}
                <Author>u/{post.author}</Author>
                {/*<div>{prettyCode}</div>*/}
                {playerName && (
                    <div>
                        <Author>
                            IGN: <b>{playerName[1]}</b>
                        </Author>
                    </div>
                )}
            </Details>
            <CopyImg src={copyImg} onClick={copyCode} />
        </Wrapper>
    );
};

interface Props {
    post: Post;
    code: string;
}

export default Code;
