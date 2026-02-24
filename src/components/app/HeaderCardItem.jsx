export function HeaderCardItem(props) {
    return (
        <div className={'col-span-3 h-[100px] flex items-center justify-between border-2 border-gray-200 p-7'}>
            <div>
                <p className={'text-3xl font-bold'}>{props.value}</p>
                <p className={'text-sm font-bold text-gray-500 mt-2'}>{props.title}</p>
            </div>
            <div>
                {props.icon}
            </div>
        </div>
    )
}