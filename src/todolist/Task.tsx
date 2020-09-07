import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from '@material-ui/core';
import {EditableSpan} from '../components/EditableSpan';
import {Delete} from '@material-ui/icons';
import {TaskType} from '../api/todolistAPI';

type TaskPropsType = {
    task: TaskType
    changeTaskStatus: (id: string, status: number) => void
    changeTaskTitle: (taskId: string, newTitle: string) => void
    removeTask: (taskId: string) => void
}
export const Task = React.memo((props: TaskPropsType) => {

    const onClickHandler = useCallback(() => props.removeTask(props.task.id),
        [props]);
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked ? 2 : 0
        props.changeTaskStatus(props.task.id, newIsDoneValue)
    }, [props]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue)
    }, [props]);
    return <div key={props.task.id} className={props.task.status === 2 ? 'is-done' : ''}>
        <Checkbox
            checked={props.task.status === 2}
            color="primary"
            onChange={onChangeHandler}/>
        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
})
