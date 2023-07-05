import React, {useState, useCallback, useContext, useEffect} from "react";
import { isEmpty } from "lodash";
import * as Constants from 'expo-constants';
import { CartContext } from "../CartContext";
import { Feather } from "@expo/vector-icons";
import { AlertDialog } from "../components/AlertDialog";
import { getValueItemAsync } from "../utils/utilitario";
import { Text as TextUILIB } from 'react-native-ui-lib';
import { Text, RefreshControl, FlatList, StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";

const API_URL = Constants.default.manifest.extra.API_URL;

export default function Notification() {

    const [empty, setEmpty] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [lastVisible, setLastVisible] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [notificacoes, setNotificacoes] = useState([]);
    const [loadingMarkAsRead, setLoadingMarkAsRead] = useState(false);
    const [numeroTotalNotificacoes, setNumeroTotalNotificacoes] = useState(0);

    const { showDialog, setShowDialog, setUnreadNotificationsNumber } = useContext(CartContext);

    const fetchNotifications = useCallback(async (isMoreView) => {
        try {
            let response =  await fetch(API_URL + 'notificacoes/mbora/lastVisible/' + lastVisible + '/isMoreView/' + isMoreView,
            {
                    headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                }
            });
            let rjd = await response.json();
            if  (!rjd.success && rjd.message == 'Autenticação') {
                setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'orange'});
            } else  if (!isEmpty(rjd.notificacao)) {
                setEmpty(false);
                setUnreadNotificationsNumber(rjd.numeroNotificacoesNaolida);
                if (isMoreView) {
                    pagination(rjd.notificacao);
                    setNotificacoes((prevState) => [...prevState, ...rjd.notificacao]);
                    if(lastVisible == rjd.idNotificacao) {
                        setEmpty(true);
                    }  
                } else {
                    setNumeroTotalNotificacoes(rjd.numeroTotalNotificacoes);
                    pagination(rjd.notificacao);
                    setNotificacoes(rjd.notificacao);
                    if(rjd.numeroTotalNotificacoes <= 10) {
                        setEmpty(true);
                    } 
                }
            } else {
                setEmpty(true);
            }
        } catch (error) {
            setRefreshing(false);
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});
        }
    }, [lastVisible]);

    function pagination(rjd) {
        setLastVisible(Math.min(... rjd.map(n => n.notification_id)));
    }

    const onRefresh = ()=> {
        setLoading(true);
        setRefreshing(true);
        fetchNotifications(false).then(()=> {
            setLoading(false);
            setRefreshing(false);
        });
    };

    const markAsRead = async(idNotification)=> {
        try {
            let response = await fetch(API_URL + 'notificacoes/mbora/read',
            {
                method: 'PUT',
                headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + await getValueItemAsync('token').catch((error)=> setShowDialog({visible: true, title: 'Erro Token', message: error.message, color: 'orangered'})),
                },
                body: JSON.stringify({idNotification: idNotification})
            });
            let rjd = await response.json();
            if(rjd.success) {
                onRefresh();
                setShowDialog({visible: true, title: rjd.message, message: rjd.data.message, color: 'green'});
            } else {
                setShowDialog({visible: true, title: 'Ocorreu um erro', message: rjd.data.message, color: 'orangered'});
            }
        } catch (error) {
            setLoadingMarkAsRead(false);
            setShowDialog({visible: true, title: 'Ocorreu um erro', message: error.message, color: 'orangered'});     
        }
      }

    const keyExtractor = (item)=> item.notification_id;
    const renderItemNotification = ({ item }) => {
        return <TouchableOpacity 
                key={item.notification_id} 
                onPress={()=> {
                    setLoadingMarkAsRead(true);
                    markAsRead(item.id).then(()=> setLoadingMarkAsRead(false))
                }}>
                    <View style={{backgroundColor: item.read_at ? null : 'aliceblue', padding: 10}}>
                        <View style={styles.section}>
                            <Feather name="box" size={20} color="green" />
                            <TextUILIB marginL-5>
                                <Text style={{fontWeight: 'bold'}}>{item.data.name + ' '}</Text>
                                <Text>{item.data.message}</Text>
                            </TextUILIB>
                        </View>
                        <TextUILIB marginL-30 style={{fontSize: 10, color: 'gray'}}>{item.formatted_created_at}</TextUILIB>
                    </View>
              </TouchableOpacity>
    };


    const FooterComponent = () => {
        return (
          <View style={styles.footer}>
            <TouchableOpacity
                onPress={()=> {
                    setLoading(true);
                    fetchNotifications(true).then(()=> setLoading(false))
                }}
                style={styles.loadMoreBtn}>
                <Text style={styles.btnText}>{loading ? 'A carregar notificações': 'Ver mais'}</Text>
                {loading ? (<ActivityIndicator color="white" style={{marginLeft: 8}} />) : null}
            </TouchableOpacity>
          </View>
        )
    }

    useEffect(() => {
        setLoading(true);
        fetchNotifications(false).then(()=> setLoading(false));
    }, []);
    

    return (
        <>
            {showDialog.visible && <AlertDialog showDialog={showDialog.visible} setShowDialog={setShowDialog} titulo={showDialog.title} mensagem={showDialog.message} cor={showDialog.color}/>}
            <FlatList
                keyExtractor={keyExtractor}
                renderItem={renderItemNotification}
                data={notificacoes}
                ListHeaderComponent={!refreshing && <Text style={{textAlign: 'center', color: 'gray', marginVertical: 5}}>{numeroTotalNotificacoes} Notificações: puxar para actualizar ⬇</Text>}
                ListFooterComponent={!empty && FooterComponent}
                ListEmptyComponent={!loading && <Text style={styles.emptyList}>Sem notificações</Text>}
                refreshControl={<RefreshControl colors={['orange']} refreshing={refreshing} onRefresh={onRefresh}/>} 
            />
            {loadingMarkAsRead && <LoadingAnimation/>}
        </>
    );
}

function LoadingAnimation() {
    return (
      <View style={styles.indicatorWrapper}>
        <ActivityIndicator size={'large'} color={'green'}/>
        <Text style={styles.indicatorText}>Loading...</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: 'orange',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
    emptyList: {
        color: 'gray',
        paddingTop: 150,
        textAlign: 'center',
    },
    section: {
        flexDirection: 'row',
    },
    indicatorWrapper: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(100, 100, 100, 0.1)',
    },
      indicatorText: {
        fontSize: 18,
        marginTop: 12,
        color: 'green'
    },
});