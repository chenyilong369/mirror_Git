import {Button} from 'antd'
import Router from 'next/router'
function handleClick() {
    Router.push({
        pathname: '/a',
        query: {
            id: 2
        }
    })
}

export default () => {
    return (
        <Button onClick = {handleClick}>
            B
        </Button>
    )
}