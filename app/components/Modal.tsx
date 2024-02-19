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
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}