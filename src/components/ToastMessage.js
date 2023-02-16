import { useContext } from "react";
import { Toast } from "react-native-ui-lib";
import { CartContext } from "../CartContext";

export default function ToastMessage() {

    const { visibleToast, setVisibleToast} = useContext(CartContext);

    return <Toast
            message={visibleToast.message}
            visible={visibleToast.visible} 
            position={'top'} 
            onDismiss={()=> setVisibleToast({visible: false})}
            autoDismiss={2000}
            backgroundColor={visibleToast.backgroundColor}/>
}