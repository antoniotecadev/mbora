import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    ScrollView,
    SafeAreaView,
    StyleSheet
} from 'react-native';
import { Avatar, Text, Button, TabController } from 'react-native-ui-lib';

const perfilImage = require('../../assets/products/car-101.jpg');

export default function Perfil({ route }) {
    const preview = { uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" };
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.infoContainer}>
                    <Avatar source={preview} size={100} animate={true} />
                    <Text color='grey' marginH-6 text80BO>António Teca</Text>
                </View>
                <Button
                    text90
                    marginH-14
                    marginB-8
                    label="Editar perfil"
                    size={Button.sizes.large}
                    borderRadius={5}
                    style={{ backgroundColor: 'green' }}
                />
                <TabController items={[{ label: 'Encomendas' }, { label: 'Favoritos' }, { label: 'A seguir' }]}>
                    <TabController.TabBar activeBackgroundColor={'green'} enableShadows/>
                    <View flex>
                        <TabController.TabPage index={0} ><Text>hhhhhh</Text></TabController.TabPage>
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
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
