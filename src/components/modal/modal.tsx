import { FC } from 'react'

type ModalProps = {
  open: boolean,
  modalLabel: string,
  children: any,
  onClose: () => void
}

const Modal : FC<ModalProps> = ({open, modalLabel, children, onClose}) => {

  const handleClose = (e: any) => {
    if(e.target.id === 'modalContainer'){
      onClose()
    }
    return null
  }

  if(open) {
    return (
      <div className="modal d-block" id="modalContainer" style={{backgroundColor: '#3f3f3fd2'}} onClick={handleClose}>
        <div className="modal-dialog">
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title'>{modalLabel}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
                {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default Modal