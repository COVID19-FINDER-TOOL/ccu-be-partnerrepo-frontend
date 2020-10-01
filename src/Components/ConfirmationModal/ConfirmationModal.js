import React, { Component } from 'react';
import {Modal, Button,Form,Col} from 'react-bootstrap'
import classes from './ConfirmationModal.module.scss'
import {FormControl} from 'react-bootstrap'


class ConfirmationModal extends Component {
      render () {
        let modalFooter='';
        let checkboxElement=""

        if(this.props.includeCheckbox &&  this.props.localCheck)
            checkboxElement=<Form.Check type="checkbox" label={this.props.checboxLeble}  onClick={this.props.checkBoxFunction}/>
        if(this.props.modalFooter==="dualButton")
             modalFooter =  <Modal.Footer>
                                <Button variant="secondary" onClick={this.props.onHide}>No</Button>
                                <Button autoFocus={true} variant="primary" className={classes.yesButton} onClick={this.props.onClick}>Yes</Button>
                           </Modal.Footer>
        else
             modalFooter =  <div>
                                <Modal.Footer><Button variant="primary" onClick={this.props.onClick}>Ok</Button></Modal.Footer> 
                                <Col className="mb-2">{checkboxElement}</Col> 
                            </div>
                            
        return (
            <Modal dialogClassName={this.props.modalClass ? classes[this.props.modalClass] : "" } backdrop={this.props.modalClass ? false : true } autoFocus={false} centered={true} onHide={this.props.closeConfirmationModal} show={this.props.showModal} size={this.props.modalClass ? "lg":"xs"}>
            <Modal.Body> 
             { this.props.message ? this.props.message.split ('\n').map ((item, i) => <p key={i}>{item}</p>) : this.props.formattedMsg ?  this.props.formattedMsg : this.props.rawTextInTextarea?this.props.rawTextInTextarea.split ('\n').map ((item, i) => <p style={{paddingBottom:"1px", paddingTop:"0px", margin:"1px"}} key={i}>{item}</p>) : console.log() }
             </Modal.Body>           
             {modalFooter}
            </Modal>
        )
    }
}

export default ConfirmationModal;