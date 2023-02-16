import { useContext } from "react";
import { Toast } from "react-native-ui-lib";
import { CartContext } from "../CartContext";

export default function ToastMessage({message, backgroundColor}) {

    const { visibleToast, setVisibleToast} = useContext(CartContext);

    return <Toast
            message={message}
            visible={visibleToast} 
            position={'top'} 
            onDismiss={()=> setVisibleToast(false)}
            autoDismiss={1000}
            backgroundColor={backgroundColor}/>
}