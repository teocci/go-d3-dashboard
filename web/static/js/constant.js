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

const RF_DATA_INPUT_TYPE = {
    legend: 'Type',
    group: 'di-type',
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
    id: 'di-file',
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

const FS_DATA_SOURCE = {
    legend: 'Data Source',
}

const FS_X_AXIS = {
    legend: 'X-Axis',
}

const IT_X_AXIS_LABEL = {
    id: 'xa-label',
    label: 'Label',
    placeholder: 'Insert x-axis label'
}

const IT_X_AXIS_UNIT = {
    id: 'xa-unit',
    label: 'Unit',
}

const S_X_AXIS_COLUMN = {
    id: 'xa-column',
    legend: 'Column',
    items: [],
}

const RF_X_AXIS_SCALE_TYPE = {
    legend: 'Scale Type',
    group: 'xa-type',
    useFieldset: false,
    inputs: [
        {
            id: 'xa-scale-type-linear',
            label: 'Linear',
            checked: true,
        },
        {
            id: 'xa-scale-type-time',
            label: 'Time',
            checked: false,
        },
        {
            id: 'xa-scale-type-log',
            label: 'Log',
            checked: false,
        },
    ],
}

const FS_SERIES = {
    legend: 'Series',
}



const DEFAULT_LINE_ATTRIBUTES = [
    {
        id: 'label',
        label: '레이블',
        type: 'text',
        options: {},
    },
    {
        id: 'unit',
        label: '단위',
        type: 'text',
        options: {
            maxLength: 5,
            size: 5,
        },
    },
    {
        id: 'column',
        label: '컬럼',
        type: 'select',
        options: {},
    },
    {
        id: 'scale',
        label: '스케일',
        type: 'select',
        options: {
            items: [
                {
                    label: 'Linear',
                    value: 'linear',
                    selected: true,
                },
                {
                    label: 'Time',
                    value: 'time',
                },
                {
                    label: 'Log',
                    value: 'log',
                },
            ],
        },
    },
    {
        id: 'curve',
        label: '커브 타입',
        type: 'select',
        options: {
            items: [
                {
                    label: 'Linear',
                    value: 'linear',
                    selected: true,
                },
                {
                    label: 'Smooth',
                    value: 'smooth',
                },
                {
                    label: 'Step',
                    value: 'step',
                },
            ],
        },
    },
    {
        id: 'width',
        label: '선 길이',
        type: 'number',
        options: {
            value: 1,
            step: .5,
            min: '0',
            max: 10,
            size: 3,
        },
    },
    {
        id: 'opacity',
        label: '투명도',
        type: 'number',
        options: {
            value: 1,
            step: .1,
            min: '0',
            max: 1,
            size: 2,
        },
    },
    {
        id: 'color',
        label: '색상',
        type: 'color',
        options: {},
    },
    {
        id: 'actions',
        label: '동작',
        type: 'actions',
        options: {},
    },
]

const DEFAULT_BAR_ATTRIBUTES = [
    {
        id: 'label',
        label: '레이블',
        type: 'text',
        options: {},
    },
    {
        id: 'unit',
        label: '단위',
        type: 'text',
        options: {
            maxLength: 5,
            size: 5,
        },
    },
    {
        id: 'column',
        label: '컬럼',
        type: 'select',
        options: {},
    },
    {
        id: 'width',
        label: '선 길이',
        type: 'number',
        options: {
            value: 1,
            step: .5,
            min: '0',
            max: 10,
            size: 3,
        },
    },
    {
        id: 'opacity',
        label: '투명도',
        type: 'number',
        options: {
            value: 1,
            step: .1,
            min: '0',
            max: 1,
            size: 2,
        },
    },
    {
        id: 'color',
        label: '색상',
        type: 'color',
        options: {},
    },
    {
        id: 'actions',
        label: '동작',
        type: 'actions',
        options: {},
    },
]




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
