import React, { useState } from 'react';
import {StyleSheet} from 'react-native'
import { Button as ButtonUILIB, Constants, Dialog, Text as TextUILIB, View as ViewUILIB, Colors } from 'react-native-ui-lib';

export const AlertDialog = ({titulo, mensagem, cor})=> {

    const [showDialog, setShowDialog] = useState(true);

    const renderPannableHeader = props => {
        const {title} = props;
        return (
          <ViewUILIB>
            <ViewUILIB margin-20>
              <TextUILIB $textDefault text65>{title}</TextUILIB>
            </ViewUILIB>
            <ViewUILIB height={2} bg-grey70/>
          </ViewUILIB>
        )
    }

    return (
    <Dialog
      useSafeArea
      key={1}
      containerStyle={styles.dialog}
      visible={showDialog}
      onDismiss={()=> setShowDialog(false)}
      renderPannableHeader={renderPannableHeader}
      pannableHeaderProps={{title: titulo}}
      supportedOrientations={['portrait', 'landscape']}
      >
        <TextUILIB $textDefault margin-20 color = {cor}>{mensagem}</TextUILIB>
        <ViewUILIB marginB-20 marginR-20 right>
          <ButtonUILIB label="OK" backgroundColor = {cor} size={ButtonUILIB.sizes.small} onPress={()=> setShowDialog(false)}/>
        </ViewUILIB>
    </Dialog>
    );
}

const styles = StyleSheet.create({
    dialog: {
      backgroundColor: Colors.$backgroundDefault,
      marginBottom: Constants.isIphoneX ? 0 : 20,
      borderRadius: 12
    },
});