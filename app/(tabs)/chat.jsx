import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'; // Import SelectDropdown
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import MaterialCommunityIcons

const ComplainPage = () => {
  const [selectedIssue, setSelectedIssue] = useState(null); // State for selected issue
  const [description, setDescription] = useState(''); // State for description

  // Handle form submission
  const handleSubmit = () => {
    console.log('Issue:', selectedIssue ? selectedIssue : '');
    console.log('Description:', description);
    // Reset form after submission
    setSelectedIssue(null);
    setDescription('');
  };

  const emojisWithIcons = [
    { title: 'Verification Problem', icon: 'emoticon-sad-outline' },
    { title: 'Client Problem', icon: 'emoticon-angry-outline' },
    { title: 'Technical Issue', icon: 'emoticon-cool-outline' },
    { title: 'Other', icon: 'emoticon-happy-outline' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Heading */}
        <Text style={styles.heading}>If you have any complaint, feel free to talk and send your query here.</Text>

        {/* Issue Selection Dropdown */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Issue Type:</Text>
          <SelectDropdown
            data={emojisWithIcons}
            onSelect={(selectedItem, index) => setSelectedIssue(selectedItem)}  // Update selected item
            buttonTextAfterSelection={(selectedItem) => selectedItem.title}  // Display selected value
            rowTextForSelection={(item) => item.title}  // Display item values
            defaultButtonText="Select Issue"
            buttonStyle={styles.picker}
            buttonTextStyle={styles.pickerText}
            dropdownStyle={styles.dropdown}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButtonStyle}>
                  {selectedItem && (
                    <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                  )}
                  <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.title) || 'Select Issue'}
                  </Text>
                  <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                  <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                  <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Issue Description Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Describe your issue here:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your issue in detail"
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComplainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8FF',
    padding: 20,
    
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#19104E',
    marginTop:30
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#19104E',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  pickerText: {
    color: '#19104E',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderColor: '#007bff',
    borderRadius: 10,
    borderWidth: 1,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 10,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
  },
  textInput: {
    height: 150,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  submitButton: {
    backgroundColor: '#266352',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});
