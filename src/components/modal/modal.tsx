import { FC } from 'react'
import styles from './modal.module.css'

type ModalProps = {
  open: boolean,
  modalLabel: string,
  children: any,
  custom_modal?: string,
  onClose: () => void
}

const Modal : FC<ModalProps> = ({open, modalLabel, children, custom_modal, onClose}) => {

  const handleClose = (e: any) => {
    if(e.target.className === 'modalContainer'){
      onClose()
    }
    return null
  }

  if(open) {
    return (
      <div className={styles.modalContainer} onClick={handleClose}>
        <div className= {`${styles.modal} ${custom_modal}`}>
          <div className={styles.modal__head}>
            <h2>{modalLabel}</h2>
            <span className={styles.modal__close} onClick={onClose}>x</span>
          </div>
          {children}
        </div>
      </div>
    )
  }
  return null
}

export default Modal