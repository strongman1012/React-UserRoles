// __mocks__/SaveAs.tsx

import React from 'react';

interface MockSaveAsProps {
    visible: boolean;
    datasetName: { id: number, name: string };
    onChange: (e: any) => void;
    onHide: () => void;
    onOk: (name: string) => void;
}

const MockSaveAs: React.FC<MockSaveAsProps> = ({
    visible,
    datasetName,
    onChange,
    onHide,
    onOk
}) => {

    const [value, setValue] = React.useState(datasetName);

    React.useEffect(() => {
        setValue(datasetName);
    }, [datasetName]);

    return (
        <div data-testid="mock-save-as">
            <input
                data-testid="template-name-input"
                value={value.name}
                onChange={(e) => {
                    setValue({ ...value, name: e.target.value });
                    onChange(e.target.value);
                }}
            />
            <button onClick={onHide}>Close</button>
            <button
                data-testid="ok-button"
                onClick={() => onOk(value.name.trim())}
                disabled={value.name.trim().length === 0}
            >
                OK
            </button>
        </div>
    );
};

export default MockSaveAs;