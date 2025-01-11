import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { goBack, navigate } from '../utils/NavigationUtils'
import { checkSession,createSession } from '../service/api/session'
import { useWS } from '../service/api/WSProvider'
import { removeHyphens } from '../utils/Helpers'
import { useUserStore } from '../service/userStore'
import { useLiveMeetStore } from '../service/meetStore'
import { joinStyles } from '../styles/joinStyles'
import { RFValue } from 'react-native-responsive-fontsize'
import { EllipsisVertical, Video,ChevronLeft } from 'lucide-react-native'
import { Colors } from '../utils/Constants'
import { LinearGradient } from 'react-native-linear-gradient'

const JoinMeetScreen = () => {
  const [code, setCode] = useState('');
  const {emit} = useWS();
  const {addSessionId,removeSessionId} = useLiveMeetStore();
  const {user, addSession,removeSession} = useUserStore();

  const createNewMeet = async () => {
    const sessionId = await createSession();
    if(sessionId){
      addSession(sessionId);
      addSessionId(sessionId);
      emit('prepare-session',{
        userId: user?.id,
        sessionId,
      });
      navigate('PrepareMeetScreen');
    }
  };
  const joinViaSessionId = async () => {
    const isAvailable = await checkSession(code);
    if(isAvailable){
      emit('prepare-session',{
        userId: user?.id,
        sessionId: removeHyphens(code),
      });
      addSession(code);
      addSessionId(code);
      navigate('PrepareMeetScreen');
    }else{
      removeSession(code);
      removeSessionId(code);
      setCode('');
      Alert.alert('There is no meeting found');
    }
  };
  return (
    <View style={joinStyles.container}>
      <SafeAreaView/>
      <View style={joinStyles.headerContainer}>
        <ChevronLeft
        size={RFValue(18)}
        onPress={() => goBack()}
        color = {Colors.text}
        />
        <Text style ={joinStyles.headerText}>Join Meet</Text>
        <EllipsisVertical size={RFValue(18)} color={Colors.text}/>
      </View>

      <LinearGradient
      colors={['#007AFF','#A6C8FF']}
      style = {joinStyles.gradientButton}
      start={{x: 0, y: 0}}
      end={{x:1,y: 1}}>
        <TouchableOpacity
        style={joinStyles.button}
        activeOpacity={0.7}
        onPress={createNewMeet}>
          <Video size={RFValue(22)} color="#fff" />
          <Text style={joinStyles.buttonText}>
            Create New Meet
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <Text style={joinStyles.orText}>
        OR
      </Text>
      <View style={joinStyles.inputContainer}>
        <Text style={joinStyles.labelText}>
          Enter the code provided by the meeting organiser
        </Text>
        <TextInput
        style={joinStyles.inputBox}
        value={code}
        onChangeText={setCode}
        returnKeyLabel="Join"
        returnKeyType="join"
        onSubmitEditing={() => joinViaSessionId()}
        placeholder = "Example: abc-mnop-xyz"
        placeholderTextColor="#888"
        />
        <Text style={joinStyles.noteText}>
          Note: This meeting is secured with Cloud encryption but not end to end encryption<Text style={joinStyles.linkText}> Learn more</Text>
        </Text>
      </View>
    </View>
  );
};


export default JoinMeetScreen;