import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../configuration/url";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { TextField } from "@mui/material";

import { Modal, ModalFooter,Button } from "reactstrap";
interface FormData {
    uuid : string;
    deviceName : string;
    deviceId : string;
    deviceType : string; 
}

interface BeaconCreationFormProps{
    modal:boolean,
    toggle:()=>void,
}
const BeaconCreation: React.FC <BeaconCreationFormProps>= ({modal,toggle}) => {
    const { organization } = useSelector((state: any) => state.Login)
    const navigate = useNavigate();
    
    const [formValues, setFormValues] = useState<FormData>({
        uuid : '',
        deviceName : '',
        deviceId : '',
        deviceType : '',
    });

    const handleSaveClick = async () => {
        const requestBody = {
            id: "",
            uuid: formValues.uuid,
            deviceName: formValues.deviceName,
            deviceId: formValues.deviceId,
            deviceType: formValues.deviceType,
            orgId: organization,
        };
        try {
            if (!formValues.uuid || !formValues.deviceId || !formValues.deviceName ) {
                toast.error('Please fill the required fields');
                return;
            }
            const response = await axios.post(`${baseURL}/sensor/register`, requestBody)
            if(response.data.message && response.data.message.code === 'MHC - 0200') {
                toast.success(response.data.message.description);
                window.location.reload();
                navigate('/beacon-table')
            } else {
                toast.warning(response.data.message.description);
            }
        } catch (error) {
            console.error("beaconCreate: ",error)
        }
    }

    return(
        <Modal isOpen={modal} toggle={toggle} size="lg" centered style={{width:'600px'}}>
      <div className="d-flex align-items-center justify-content-center vh-90">
      <div className="row">
      <div className="container col-md-12">
      <div className="d-flex justify-content-center align-items-center">
              <h3 className="mt-1">Beacon Registration</h3>
            </div>
            <hr></hr>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                    <div className="col-md-7 mb-2">
                        <TextField id="outlined-basic-1" label="Unique Id" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, uuid: e.target.value})} />
                    </div>
                </div>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-7 mb-2">
                        <TextField id="outlined-basic-1" label="device Id" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceId: e.target.value})} />
                </div>
                </div>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-7 mb-2">
                        <TextField id="outlined-basic-1" label="device Name" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceName: e.target.value})} />
                </div>
                </div>
                <div className="row w-100" style={{alignItems:"center",justifyContent:"center",marginTop:'10px'}}>
                <div className="col-md-7 mb-2">
                        <TextField id="outlined-basic-1" label="device Type" variant="outlined" fullWidth onChange={(e) => setFormValues({...formValues, deviceType: e.target.value})} />
                </div>
                </div>
                </div>
                <div className="d-flex gap-3 justify-content-center mt-4">
          <ModalFooter>
            <Button onClick={toggle} className="btn-danger">Cancel</Button>
            <Button onClick={handleSaveClick} className="btn-success">Save Changes</Button>
          </ModalFooter>
        </div>
        <ToastContainer/>
           
        </div>
        </div>
        </Modal>
    )
}

export default BeaconCreation;
