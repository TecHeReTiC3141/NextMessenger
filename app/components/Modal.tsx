import React from "react";

interface ModalProps {
    id: string,
    children: React.ReactNode,
}

export default function Modal({id, children}: ModalProps) {
    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                {children}
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-1.5 top-1.5">✕</button>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}