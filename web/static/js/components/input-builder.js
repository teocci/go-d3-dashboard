import InputText from './input-text.js'
import InputNumber from './input-number.js'
import Select from './select.js'
import InputColor from './input-color.js'
import Fieldset from './fieldset.js'
import FieldsetRadio from './fieldset-radio.js'
import FieldsetCheckbox from './fieldset-checkbox.js'
import InputConnection from './input-connection.js'

/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-11월-22
 */
export default class InputBuilder {
    static createField(options, $holder) {
        const type = options.type ?? null
        $holder = $holder ?? null

        let field = null
        switch (type) {
            case InputText.TAG:
                field = new InputText($holder, options)
                break
            case InputNumber.TAG:
                field = new InputNumber($holder, options)
                break
            case Select.TAG:
                field = new Select($holder, options)
                break
            case InputColor.TAG:
                field = new InputColor($holder, options)
                break
            case Fieldset.TAG:
                field = new Fieldset($holder, options)
                break
            case FieldsetRadio.TAG:
                field = new FieldsetRadio($holder, options)
                break
            case FieldsetCheckbox.TAG:
                field = new FieldsetCheckbox($holder, options)
                break
            case InputConnection.TAG:
                field = new InputConnection($holder, options)
                break
            default:
                throw new Error(`InvalidType: type ${type} not supported`)
        }

        return field
    }
}