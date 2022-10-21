/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-6월-13
 */

let mainModule
let settings

const DEFAULT_STRUCTURE_SETTINGS = {
    fieldset: {
        legend: '차트 설정',
    },
    input: {
        fieldset: {
            legend: '데이터 투입',
        },
        mode: {
            legend: '타입',
            group: 'di-type',
            useFieldset: false,
            inputs: [
                {
                    id: 'di-type-file',
                    label: 'CSV 파일',
                    value: 'file',
                    checked: true,
                },
                {
                    id: 'di-type-realtime',
                    label: '실시간',
                    value: 'realtime',
                    checked: false,
                },
            ],
        },
        file: {
            id: 'di-file',
            label: '파일',
            text: '파일 선택',
            accept: '.csv',
            mimeTypes: [
                'text/csv',
            ],
        },
        connect: {
            id: 'di-connection',
            label: 'Connection',
        },
    },
    chart: {
        fieldset: {
            legend: '차트',
        },
        type: {
            id: 'chart-type',
            legend: '타입',
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
            ],
        },
        title: {
            id: 'chart-title',
            label: '제목',
            placeholder: '차트 제목 입력',
            required: true,
        },
    },
    source: {
        fieldset: {
            legend: '데이터 소스',
        },
    },
}

const DEFAULT_AXIS = {
    fieldset: {
        legend: '축',
    },
    label: {
        id: 'axis-label',
        label: '레이블',
        placeholder: '축 레이블 입력',
    },
    unit: {
        id: 'axis-unit',
        label: '단위',
    },
    column: {
        id: 'axis-column',
        legend: '컬럼',
        items: [],
    },
    scale: {
        legend: '스케일 타입',
        group: 'axis-scale-type',
        useFieldset: false,
        inputs: [
            {
                id: 'axis-scale-type-linear',
                label: '선형',
                value: 'linear',
                checked: true,
            },
            {
                id: 'axis-scale-type-time',
                label: '시계열',
                value: 'time',
                checked: false,
            },
            {
                id: 'axis-scale-type-log',
                label: '로그',
                value: 'log',
                checked: false,
            },
        ],
    },
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
                    label: '선형',
                    value: 'linear',
                    selected: true,
                },
                {
                    label: '시계열',
                    value: 'time',
                },
                {
                    label: '로그',
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
                    label: '리니어',
                    value: 'linear',
                    selected: true,
                },
                {
                    label: '스무스',
                    value: 'smooth',
                },
                {
                    label: '스텝',
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
            value: 2,
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

const LINE_SERIES = {
    fieldset: {
        legend: '시리즈',
    },
    series: DEFAULT_LINE_ATTRIBUTES,
}

const FS_SETTINGS = {
    legend: '차트 설정',
}

const FS_DATA_INPUT = {
    legend: '데이터 투입',
}

const FS_CHART = {
    legend: '차트',
}

const RF_DATA_INPUT_MODE = {
    legend: '타입',
    group: 'di-type',
    useFieldset: false,
    inputs: [
        {
            id: 'di-type-file',
            label: 'CSV 파일',
            checked: true,
        },
        {
            id: 'di-type-realtime',
            label: '실시간',
            checked: false,
        },
    ],
}

const IF_FILE = {
    id: 'di-file',
    label: '파일',
    text: '파일 선택',
    accept: '.csv',
    mimeTypes: [
        'text/csv',
    ],
}

const IT_CONNECTION = {
    id: 'di-connection',
    label: 'Connection',
}

const S_CHART_TYPE = {
    id: 'chart-type',
    legend: '타입',
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

const IT_CHART_TITLE = {
    id: 'chart-title',
    label: '제목',
    placeholder: '차트 제목 삽입',
    required: true,
}

const FS_DATA_SOURCE = {
    legend: '데이터 소스',
}

const FS_X_AXIS = {
    legend: 'X축',
}

const IT_X_AXIS_LABEL = {
    id: 'xa-label',
    label: '레이블',
    placeholder: 'Insert x-axis label',
}

const IT_X_AXIS_UNIT = {
    id: 'xa-unit',
    label: '단위',
}

const S_X_AXIS_COLUMN = {
    id: 'xa-column',
    legend: '컬럼',
    items: [],
}

const RF_X_AXIS_SCALE_TYPE = {
    legend: '스케일 타입',
    group: 'xa-scale-type',
    useFieldset: false,
    inputs: [
        {
            id: 'xa-scale-type-linear',
            label: '선형',
            checked: true,
        },
        {
            id: 'xa-scale-type-time',
            label: '시계열',
            checked: false,
        },
        {
            id: 'xa-scale-type-log',
            label: '로그',
            checked: false,
        },
    ],
}

const FS_SERIES = {
    legend: 'Series',
}

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
