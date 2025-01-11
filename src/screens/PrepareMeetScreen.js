import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useWS } from '../service/api/WSProvider';
import { useLiveMeetStore } from '../service/meetStore.js';
import { useUserStore } from '../service/userStore';
import { mediaDevices,RTCView} from 'react-native-webrtc';
import { addHyphens,requestPermissions } from '../utils/Helpers';
import { prepareStyles } from '../styles/prepareStyles';
import { ChevronLeft, EllipsisVertical } from 'lucide-react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RFValue } from 'react-native-responsive-fontsize';
import { goBack } from '../utils/NavigationUtils';

const PrepareMeetScreen = () => {
  const {emit,on,off} = useWS();
  const {addParticipant, sessionId, addSessionId, toggle, micOn, videoOn} = 
  useLiveMeetStore();
  const {user} = useUserStore();

  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const handleParticipantUpdate = updatedParticipants => {
      setParticipants(updatedParticipants);
    };
    on('session-info',handleParticipantUpdate);

    return () => {
      if(localStream){
        localStream.getTracks().forEach(track => track.stop());
        localStream?.release();
      }
      setLocalStream(null);
      off('session-info',handleParticipantUpdate);
    };
  },[sessionId, emit, on, off, localStream]);

  const showMediaDevices = (audio,video) =>{
    mediaDevices
    ?.getUserMedia({
      audio,
      video,
    })
    .then(stream=>{
      setLocalStream(stream);
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];
      if(audioTrack){
        audioTrack.enabled = audio;
      }
      if(videoTrack){
        videoTrack.enabled = video;
      }
    })
    .catch(err =>{
      console.log('Error getting media device',err);
    });
  };

  const toggleMicState = newState =>{
    if(localStream){
      const audioTrack = localStream.getAudioTrack()[0];
      if(audioTrack){
        audioTrack.enabled = newState;
      }
    }
  };

  const toggleVideoState = newState => {
    if(localStream){
      const videoTrack = localStream.getVideoTracks()[0];
      if(videoTrack){
        videoTrack.enabled = newState;
      }
    }
  };

  const toggleLocal = type=>{
    if(type === 'mic'){
      const newMicState = !micOn;
      toggleMicState(newMicState);
      toggle('mic');
    }
    if(type === 'video'){
      const newVideoState = !videoOn;
      toggleVideoState(newVideoState);
      toggle('video');
    }
  }

  const fetchMediaPremissions = async () => {
    const result = await requestPermissions();
    if(result.isCameraGranted){
      toggleLocal('video');
    }
    if(result.isMicrophoneGranted){
      toggleLocal('mic');
    }
    showMediaDevices(result.isMicrophoneGranted, result.isCameraGranted);
  };

  useEffect(() => {
    fetchMediaPremissions();
  }, []);

  return (
    <View>
      <Text>PrepareMeetScreen</Text>
      <Text>{renderParticipantText(participants)}</Text>
    </View>
  );
};

const handleStartCall = async() =>{
  try {
    emit("join-session",{sessionId});
      name: user.name,
      photo:user?.photo,
      userId:user?.id,
      sessionId:sessionId,
      micOn,
      videoOn
    })
    participants.forEach(i=>addParticipant(i));
    addSessionId(sessionId);
    replace('LiveMeetScreen');

  }catch(error){
    console.log("Error starting call",error);
  }
}
const renderParticipantText = (participants) => {
const renderParticipantText = () =>{
  if(participants?.length === 0){
    return 'No One is in the call yet';
  }

  const names = participants
  ?.slice(0,2)
  ?.map(p =>p.name)
  ?.join(', ');

  const count = 
  participants.length > 2 ? `and ${participants.length - 2} others` : '';
   return `${names} ${count} in the call`;
  };

return (
  <View style={prepareStyles.container}>
    <SafeAreaView />
    <View style={prepareStyles.headerContainer}>
      <ChevronLeft
      size={RFValue(22)}
      onPress={() => {
        goBack();
        addSessionId(null);
      }} 
      color = {Colors.text}
    />
    <EllipsisVertical size={RFValue(18)} color={Colors.text}/>
    </View>
  <ScrollView contentContainerStyle={{flex:1}}>
    <View style={prepareStyles.videoContainer}>
      <Text style = {prepareStyles.meetingCode}>
        {addHyphens(sessionId)}

      </Text>
    </View>
    </ScrollView>
    </View>
    );
};

export default PrepareMeetScreen;

