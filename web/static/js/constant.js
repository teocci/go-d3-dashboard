/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-6월-13
 */

let mainModule
let settings

const DEFAULT_STRUCTURE_SETTINGS = {
    fieldset: {
        type: 'fieldset',
        legend: '차트 설정',
        classes: ['setting'],
    },
    input: {
        fieldset: {
            type: 'fieldset',
            legend: '데이터 투입',
            classes: ['data-input'],
        },
        mode: {
            type: 'radios',
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
            type: 'file',
            id: 'di-file',
            label: '파일',
            text: '파일 선택',
            accept: '.csv',
            mimeTypes: [
                'text/csv',
            ],
        },
        connect: {
            type: 'text',
            id: 'di-connection',
            label: 'Connection',
        },
    },
    chart: {
        fieldset: {
            type: 'fieldset',
            legend: '데이터 차트',
            classes: ['data-chart'],
        },
        type: {
            type: 'select',
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
            type: 'text',
            id: 'chart-title',
            label: '제목',
            placeholder: '차트 제목 입력',
            required: true,
        },
    },
    source: {
        fieldset: {
            type: 'fieldset',
            legend: '데이터 소스',
            classes: ['data-source'],
        },
    },
}

const DEFAULT_AXIS = {
    fieldset: {
        type: 'fieldset',
        legend: '축',
        classes: ['axis'],
    },
    label: {
        type: 'text',
        id: 'axis-label',
        label: '레이블',
        placeholder: '축 레이블 입력',
    },
    unit: {
        type: 'text',
        id: 'axis-unit',
        label: '단위',
    },
    column: {
        type: 'select',
        id: 'axis-column',
        legend: '컬럼',
        items: [],
    },
    scale: {
        type: 'radios',
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

const EXTEND_SCATTER_AXIS = {
    radius: {
        type: 'number',
        id: 'axis-radius',
        label: '반지름',
        value: 2,
        step: .5,
        min: 0,
        max: 10,
        size: 3,
    },
    'border-width': {
        type: 'number',
        id: 'axis-border-width',
        label: '너비',
        value: 2,
        step: .5,
        min: 0,
        max: 10,
        size: 3,
    },
    'border-color': {
        type: 'color',
        id: 'axis-border-color',
        label: '색상',
    },
}

const EXTEND_BUBBLE_RADIUS = {
    borderWidth: {
        type: 'number',
        id: 'axis-border-width',
        label: '너비',
        value: 2,
        step: .5,
        min: 0,
        max: 10,
        size: 3,
    },
    borderColor: {
        type: 'color',
        id: 'axis-border-color',
        label: '색상',
    },
    backgroundColor: {
        type: 'color',
        id: 'axis-background-color',
        label: '배경색',
    },
    backgroundOpacity: {
        type: 'number',
        id: 'axis-background-opacity',
        label: '투명도',
        value: 1,
        step: .1,
        min: 0,
        max: 1,
        size: 2,
    },
}

const DEFAULT_LINE_ATTRIBUTES = [
    {
        type: 'text',
        id: 'label',
        label: '레이블',
        options: {},
    },
    {
        type: 'text',
        id: 'unit',
        label: '단위',
        options: {
            maxLength: 5,
            size: 5,
        },
    },
    {
        type: 'select',
        id: 'column',
        label: '컬럼',
        options: {},
    },
    {
        type: 'select',
        id: 'scale',
        label: '스케일',
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
        type: 'select',
        id: 'curve',
        label: '커브 타입',
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
        type: 'number',
        id: 'width',
        label: '선 길이',
        options: {
            value: 2,
            step: .5,
            min: 0,
            max: 10,
            size: 3,
        },
    },
    {
        type: 'number',
        id: 'opacity',
        label: '투명도',
        options: {
            value: 1,
            step: .1,
            min: 0,
            max: 1,
            size: 2,
        },
    },
    {
        type: 'color',
        id: 'color',
        label: '색상',
        options: {},
    },
    {
        type: 'actions',
        id: 'actions',
        label: '동작',
        options: {},
    },
]

const DEFAULT_BAR_ATTRIBUTES = [
    {
        type: 'text',
        id: 'label',
        label: '레이블',
        options: {},
    },
    {
        type: 'text',
        id: 'unit',
        label: '단위',
        options: {
            maxLength: 5,
            size: 5,
        },
    },
    {
        type: 'select',
        id: 'column',
        label: '컬럼',
        options: {},
    },
    {
        type: 'select',
        id: 'scale',
        label: '스케일',
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
        type: 'number',
        id: 'width',
        label: '테두리 너비',
        options: {
            value: 2,
            step: .5,
            min: '0',
            max: 10,
            size: 3,
        },
    },
    {
        type: 'color',
        id: 'color',
        label: '테두리 색상',
        options: {},
    },
    {
        type: 'color',
        id: 'background',
        label: '배경색',
        options: {},
    },
    {
        type: 'number',
        id: 'opacity',
        label: '배경 불투명도',
        options: {
            value: 1,
            step: .1,
            min: '0',
            max: 1,
            size: 2,
        },
    },
    {
        type: 'actions',
        id: 'actions',
        label: '동작',
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
