import { View, Text, SafeAreaView, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '../../service/userStore'
import InquiryModal from './InquiryModal';
import { headerStyles } from '../../styles/headerStyles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RFValue } from 'react-native-responsive-fontsize';
import {CircleUser, Menu} from 'lucide-react-native';
import { navigate } from '../../utils/NavigationUtils';

const HomeHeader = () => {
    const [visible, setVisible] = useState(false);
    const {user} = useUserStore();

    useEffect(()=>{
        const checkUserName = () =>{
            const storedName = user?.name;
            if(!storedName){
                setVisible(true);
            }
        };
        checkUserName();
    }, []);

    const handleNavigation = ()=>{
            const storedName = user?.name;
            if(!storedName){
                setVisible(true);
                return;
            }
            navigate('JoinMeetScreen');
    };

  return (
    <>
      <SafeAreaView/>
      <View style={headerStyles.container}>
        <Menu name="menu" size={RFValue(20)} color= {Colors.text}/>
        <TouchableOpacity style={headerStyles.textContainer} onPress={handleNavigation}>
            <Text style={headerStyles.placeholderText}>
                Enter a Meeting Code
            </Text>
        </TouchableOpacity>
        <CircleUser
        onPress={()=> setVisible(true)}
        name="menu"
        size= {RFValue(20)}
        color={Colors.primary}
        />

      </View>
      <InquiryModal onClose={()=> setVisible(false)} visible = {visible}/>
    </>
  )
}

export default HomeHeader;