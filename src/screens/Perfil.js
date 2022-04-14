import React, { useEffect, useState, useContext } from 'react';
import {
    Image,
    View,
    ScrollView,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import { Avatar, Text, Button, Colors, TabController } from 'react-native-ui-lib';

const perfilImage = require('../../assets/products/car-101.jpg');

export default function Perfil({ route }) {

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.infoContainer}>
                    <Avatar source={perfilImage} size={100} animate={true} />
                    <Text orange40 marginL-6 text70BL>António Teca</Text>
                </View>
                <Button
                    text90
                    margin-16
                    label="Editar perfil"
                    size={Button.sizes.large}
                    borderRadius={5}
                    style={{ backgroundColor: Colors.$backgroundSuccessHeavy }}
                    iconStyle={{ tintColor: Colors.black }}
                />
                <TabController items={[{ label: 'Compras' }, { label: 'Favoritos' }, { label: 'A seguir' }]}>
                    <TabController.TabBar enableShadows />
                    <View flex>
                        <TabController.TabPage index={0}><Text>hhhhhh</Text></TabController.TabPage>
                        <TabController.TabPage index={1} lazy><Text>oooo</Text></TabController.TabPage>
                        <TabController.TabPage index={2} lazy><Text>llllll</Text></TabController.TabPage>
                    </View>
                </TabController>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    infoContainer: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
});
