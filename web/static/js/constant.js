/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-6월-13
 */

let mainModule

const FS_CHART_SETTINGS = {
    legend: 'Chart Settings',
}

const FS_DATA_INPUT = {
    legend: 'Data Input',
}

const FS_CHART = {
    legend: 'Chart',
}

const RF_TYPE = {
    legend: 'Type',
    group: 'data-input-type',
    useFieldset: false,
    inputs: [
        {
            id: 'di-type-file',
            label: 'CSV File',
            checked: true,
        },
        {
            id: 'di-type-realtime',
            label: 'Realtime',
            checked: false,
        },
    ],
}

const IF_FILE = {
    label: 'File',
    accept: '.csv',
    mimeTypes: [
        'text/csv',
    ]
}

const IT_CONNECTION = {
    id: 'di-connection',
    label: 'Connection',
}

const S_CHART_TYPE = {
    id: 'chart-type',
    legend: 'Type',
    items: [
        {
            label: 'Line Chart',
            value: 'line',
            selected: true,
        },
        {
            label: 'Bar Chart',
            value: 'bar',
        },
        {
            label: 'Bubble Chart',
            value: 'bubble',
        },
        {
            label: 'Scatter Chart',
            value: 'scatter',
        },
        {
            label: 'Contour Chart',
            value: 'contour',
        },
    ],
}

const IT_CHART_TYPE = {
    id: 'chart-title',
    label: 'Title',
    placeholder: 'Insert a Chart Title'
}

const TEST_FIELDS = {
    fieldset: {
        legend: 'Test Fieldset',
    },
    text: {
        label: 'Input Text',
        placeholder: 'Enter your name',
    },
    checkbox: {
        legend: 'City',
        group: 'cb-city',
        inputs: [
            {
                id: 'huey',
                label: 'Huey',
                value: 'huey',
                checked: true,
            },
            {
                id: 'dewey',
                label: 'Dewey',
                value: 'dewey',
                checked: false,
            },
            {
                id: 'louie',
                label: 'Louie',
                value: 'louie',
                checked: false,
            },
        ],
    },
    radio: {
        legend: 'Main Feature',
        group: 'feature',
        useFieldset: false,
        inputs: [
            {
                id: 'scales',
                label: 'Scales',
                checked: true,
            },
            {
                id: 'horns',
                label: 'Horns',
                checked: false,
            },
            {
                id: 'fangs',
                label: 'Fangs',
                checked: false,
            },
            {
                id: 'wings',
                label: 'Wings',
                checked: false,
            },
        ],
    },
}

const BASE_FORM = {
    'data-input': {
        type: 'fieldset',
        legend: 'Data Input',
    },
    text: {
        label: 'Input Text',
        placeholder: 'Enter your name',
    },
    checkbox: {
        type: 'checkbox',
        legend: 'City',
        group: 'cb-city',
        inputs: [
            {
                id: 'huey',
                label: 'Huey',
                value: 'huey',
                checked: true,
            },
            {
                id: 'dewey',
                label: 'Dewey',
                value: 'dewey',
                checked: false,
            },
            {
                id: 'louie',
                label: 'Louie',
                value: 'louie',
                checked: false,
            },
        ],
    },
}


// children: {
//     type: {
//         legend: 'Type',
//             group: 'data-input-type',
//             useFieldset: false,
//             inputs: [
//             {
//                 id: 'di-type-file',
//                 label: 'CSV File',
//                 checked: true,
//             },
//             {
//                 id: 'di-type-realtime',
//                 label: 'Realtime',
//                 checked: false,
//             },
//         ],
//     },
//     file: {
//         id: 'di-file',
//             label: 'File',
//             accept: '.csv',
//     },
// },