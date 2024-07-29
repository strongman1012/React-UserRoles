import React from "react";
import { FC, useEffect, useState } from "react";
import CodeEditor from "./CodeEditor";
import { sampleData, templateScriptData } from "../assets/data";
import { TFile } from "../types";

const ScriptManager: FC = () => {

    const [scriptList, setScriptList] = useState<TFile[]>([]);
    const extTypes = ['.js', '.py'];

    useEffect(() => {
        setScriptList(sampleData);
    }, []);

    const updateScript = (file: TFile) => {
        const existingScriptIndex = scriptList.findIndex(item => item.id === file.id);

        if (existingScriptIndex !== -1 && file.id !== undefined) {
            // Update existing script
            setScriptList(prevScriptList => {
                const updatedList = [...prevScriptList];
                updatedList[existingScriptIndex] = file;
                return updatedList;
            });
        } else {
            // Add new script
            setScriptList(prevScriptList => [...prevScriptList, {
                id: file.id,
                name: file.name,
                ext: file.ext,
                script: file.script
            }]);
        }
    }

    const deleteScript = (id: string) => {
        id !== undefined && setScriptList(scriptList.filter((l: TFile) => l.id !== id))
    }

    async function uploadScript(file: TFile) {

        const newList = scriptList.map((x) => {
            if (x.name === file.name) {
                return { ...x, script: file.script, custom: true }
            } else {
                return x
            }
        });

        setScriptList(newList);
    }

    async function resetScript(file: TFile) {

        const newList: TFile[] = scriptList.map((x) => {
            if (x.name === file.name) {
                const origScript = sampleData.find((y) => y.name === x.name)?.script;
                return { ...x, script: origScript ?? file.script, custom: false }
            } else {
                return x
            }
        });
        setScriptList(newList);
    }

    return (
        <CodeEditor
            scriptList={scriptList}
            isEditable={true}
            templateScripts={templateScriptData}
            extTypes={extTypes}
            deleteScript={deleteScript}
            updateScript={updateScript}
            refreshScripts={() => { }}
            setChangesMade={() => { }}
            deployUpdatedScript={uploadScript}
            resetScript={resetScript}
        />
    );
}

export default ScriptManager;