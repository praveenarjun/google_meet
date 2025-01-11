import 'react-native-get-random-values';
import { View, Text,Modal, Touchable, TouchableWithoutFeedback, Alert, Keyboard, KeyboardAvoidingView, ScrollView, Platform, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid';
import { inquiryStyles } from '../../styles/inquiryStyles';
import { useUserStore } from '../../service/userStore';

const InquiryModal = ({visible,onClose}) => {
    const {setUser,user} = useUserStore();
    const [name,setName] = useState('');
    const [profilePhotoUrl,setProfilePhotoUrl] = useState('');

    useEffect(() =>{
        if(visible){
            const storedName = user?.name;
            const storedProfilePhotoUrl = user?.photo;
            setName(storedName || '');
            setProfilePhotoUrl(storedProfilePhotoUrl || '');
        }
    }, [visible]);

    const handleSave = () =>{
        if(name && profilePhotoUrl){
            setUser({
                id:uuidv4(),
                name,
                photo:profilePhotoUrl,
            });
            onClose();
        }else{
            Alert.alert('Please fill in the fields')
        }
    };
  return (
    <Modal
        visible ={visible}
        animationType='slide'
        transparent={true}
        onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={inquiryStyles.modalContainer}>
                <KeyboardAvoidingView
                behavior={Platform.OS ==='ios' ? 'padding' : 'height'}
                style={inquiryStyles.keyboardAvoidingView}>
                    <ScrollView contentContainerStyle={inquiryStyles.scrollViewContent}>
                        <View style={inquiryStyles.modalContent}>
                            <Text styles={inquiryStyles.title}> Enter Your Details</Text>
                            <TextInput
                            style={inquiryStyles.input}
                            placeholder='Enter Your Name'
                            value={name}
                            onChangeText={setName}
                            placeholderTextCOlor={'#ccc'}
                            />
                            <TextInput
                            style={inquiryStyles.input}
                            placeholder='Enter Your Plofile photo Url'
                            value={profilePhotoUrl}
                            onChangeText={setProfilePhotoUrl}
                            placeholderTextCOlor={'#ccc'}
                            />
                            <View style={inquiryStyles.buttonContainer}>
                                <TouchableOpacity style ={inquiryStyles.button} onPress={handleSave} >
                                    <Text style={inquiryStyles.buttonText}>
                                        Save
                                    </Text>
                                </TouchableOpacity>
                                 <TouchableOpacity style ={[inquiryStyles.button,inquiryStyles.cancelButton]} onPress={onClose} >
                                    <Text style={inquiryStyles.buttonText}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </View> 
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
    </Modal>
  )
}

export default InquiryModal