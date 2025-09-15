import classNames from "classnames";
import React from "react";

export function FileListItemLabel({children, isSelected, onClick}: {children: React.ReactNode, isSelected?: boolean, onClick: () => void}) {
    return (
        <div className={classNames(`file-list-item-label grid grid-cols-[min-content_1fr_min-content] items-center gap-2 py-1 px-2 cursor-pointer hover:bg-gray-200 min-w-0 max-w-full`, { 'bg-violet-200': isSelected })} onClick={onClick}>
            {children}
        </div>
    );
}
