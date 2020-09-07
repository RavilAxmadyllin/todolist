import React from 'react'
import {action} from '@storybook/addon-actions'
import {AddItemForm} from '../components/AddItemForm'

export default {
    title: 'AddItemForm Stories',
    component: AddItemForm
}

export const AddItemFormBaseExample = (props: any) => {
    return (<AddItemForm
        addItem={action('Button inside form clicked')}
    />)
}
