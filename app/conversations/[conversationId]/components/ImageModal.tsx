import Modal from "@/app/components/Modal";
import Image from "next/image";

interface ImageModalProps {
    src: string,
}

export default function ImageModal({ src }: ImageModalProps) {
    return (
        <Modal id={`image-modal-${src}`}>
            <div className="min-h-64 max-w-xl">
                <Image src={src} alt="Image" className="object-cover cursor-pointer" fill/>
            </div>
        </Modal>
    )
}