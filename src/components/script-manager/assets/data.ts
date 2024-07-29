export const sampleData = [
    {
        id: '1',
        name: "script-1",
        ext: ".js",
        script: `
            <script>
                console.log('script-1');
            </script>
        `,
        custom: false,
        editable: false
    },
    {
        id: '2',
        name: "script-2",
        ext: ".js",
        script: `
            <script>
                console.log('script-2');
            </script>
        `,
        custom: false,
        editable: true
    },
    {
        id: '3',
        name: "script-3",
        ext: ".py",
        script: `
            print("Script 3")
        `,
        custom: false,
        editable: true
    }
];


export const templateScriptData = [{
    ext: '.js',
    script: `
        <script>
            console.log('script-new');
        </script>
    `
}]