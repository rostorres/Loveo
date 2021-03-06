import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Picker,
  ScrollView,
  Switch,
  ToastAndroid,
} from 'react-native';
import { graphql, compose } from 'react-apollo';
import { USERS_QUERY } from '../graphql/users.query';
import withLoading from '../components/withLoading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent: 'flex-start',
    // 'center', 'flex-start', 'flex-end', 'space-around', 'space-between'
    // alignItems: "flex-start", // 'center', 'flex-start', 'flex-end', 'stretched'
    paddingTop: 10,
  },
  main: {
    flex: 0.9,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 5,
  },
  submit: {
    flex: 0.1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  title: {
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    height: 40,
    padding: 10,
    // backgroundColor: '#c7d6db',
    borderRadius: 10,
    // color: '#7a42f4',
    width: 200,
  },
  label: {
    marginBottom: 0,
    marginTop: 0,
    marginLeft: 15,
    marginRight: 15,
    height: 30,
    padding: 3,
    paddingLeft: 10,
    backgroundColor: '#c7d6db',
    borderRadius: 10,
    // color: '#7a42f4',
    width: 200,
  },
  viewSwitchPicker: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // space-around, space-between and space-evenly
  },
  picker: {
    flex: 0.9,
    marginBottom: 15,
    marginTop: 0,
    marginLeft: 15,
    marginRight: 15,
    borderColor: '#9cb1b7',
    height: 30,
    borderRadius: 10,
    padding: 3,
    paddingLeft: 10,
    // color: '#7a42f4',
    width: 200,
  },
  switch: {
    flex: 0.1,
  },
  submitButton: {
    backgroundColor: '#9cb1b7',
    padding: 10,
    margin: 15,
    height: 40,
    borderRadius: 20,
    width: 200,
  },
  submitButtonText: {
    textAlign: 'center',
  },
});

class Lifestyle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 1,
      gender: 'todos',
      civilStatus: 'todos',
      children: 'todos',
      switchGenderValue: false,
      switchCivilStatusValue: false,
      switchChildrenValue: false,
      enabledpickerGender: false,
      enabledpickerCivilStatus: false,
      enabledpickerChildren: false,
      genderThumbcolor: 'red',
      civilStatusThumbcolor: 'red',
      childrenThumbcolor: 'red',
    };
  }

  resetState = () => {
    this.setState({
      gender: 'todos',
      civilStatus: 'todos',
      children: 'todos',
      switchGenderValue: false,
      switchCivilStatusValue: false,
      switchChildrenValue: false,
      enabledpickerGender: false,
      enabledpickerCivilStatus: false,
      enabledpickerChildren: false,
      genderThumbcolor: 'red',
      civilStatusThumbcolor: 'red',
      childrenThumbcolor: 'red',
    });
  };

  goToResult = () => {
    const {
      navigation: { navigate },
    } = this.props;
    const {
      userId, gender, civilStatus, children,
    } = this.state;
    // console.log("ppppp", gender);
    navigate('LifestyleResult', {
      userId,
      gender,
      civilStatus,
      children,
    });
    this.resetState();
  };

  switchGender = () => {
    const { switchGenderValue } = this.state;
    if (switchGenderValue) {
      this.setState({
        switchGenderValue: false,
        enabledpickerGender: false,
        genderThumbcolor: 'red',
        gender: 'todos',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por genero desativada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      this.setState({
        switchGenderValue: true,
        enabledpickerGender: true,
        genderThumbcolor: 'blue',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por genero ativada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  switchCivilStatus = () => {
    const { switchCivilStatusValue } = this.state;
    if (switchCivilStatusValue) {
      this.setState({
        switchCivilStatusValue: false,
        enabledpickerCivilStatus: false,
        civilStatusThumbcolor: 'red',
        civilStatus: 'todos',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por estado civil desativada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      this.setState({
        switchCivilStatusValue: true,
        enabledpickerCivilStatus: true,
        civilStatusThumbcolor: 'blue',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por estado civil ativada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  switchChildren = () => {
    const { switchChildrenValue } = this.state;
    if (switchChildrenValue) {
      this.setState({
        switchChildrenValue: false,
        enabledpickerChildren: false,
        childrenThumbcolor: 'red',
        children: 'todos',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por tener hijos desativada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    } else {
      this.setState({
        switchChildrenValue: true,
        enabledpickerChildren: true,
        childrenThumbcolor: 'blue',
      });
      ToastAndroid.showWithGravity(
        'Busqueda por tener hijos ativada.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };

  render() {
    const { users } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <ScrollView>
            <Text style={styles.title}>Preferencias de Búsqueda </Text>
            <Text style={styles.label}>por Genero: </Text>

            <View style={styles.viewSwitchPicker}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.gender}
                onValueChange={gender => this.setState({ gender })}
                enabled={this.state.enabledpickerGender}
              >
                <Picker.Item label="todos" value="todos" />
                <Picker.Item label="hombre" value="hombre" />
                <Picker.Item label="mujer" value="mujer" />
                <Picker.Item label="otro" value="otro" />
              </Picker>
              <Switch
                style={styles.switch}
                onValueChange={this.switchGender}
                value={this.state.switchGenderValue}
                thumbColor={this.state.genderThumbcolor}
              />
            </View>

            <Text style={styles.label}>Estado Civil: </Text>
            <View style={styles.viewSwitchPicker}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.civilStatus}
                onValueChange={civilStatus => this.setState({ civilStatus })}
                enabled={this.state.enabledpickerCivilStatus}
              >
                <Picker.Item label="todos" value="todos" />
                <Picker.Item label="soltero" value="soltero" />
                <Picker.Item label="divorciado" value="divorciado" />
                <Picker.Item label="separado" value="separado" />
                <Picker.Item label="casado" value="casado" />
                <Picker.Item label="viudo" value="viudo" />
                <Picker.Item label="no especificado" value="no especificado" />
              </Picker>
              <Switch
                style={styles.switch}
                onValueChange={this.switchCivilStatus}
                value={this.state.switchCivilStatusValue}
                thumbColor={this.state.civilStatusThumbcolor}
              />
            </View>

            <Text style={styles.label}>por Tener o no Tener Hijos: </Text>
            <View style={styles.viewSwitchPicker}>
              <Picker
                style={styles.picker}
                selectedValue={this.state.children}
                onValueChange={children => this.setState({ children })}
                enabled={this.state.enabledpickerChildren}
              >
                <Picker.Item label="todos" value="todos" />
                <Picker.Item label="no tiene hijos" value="no tiene hijos" />
                <Picker.Item label="tiene hijos" value="tiene hijos" />
                <Picker.Item label="no especificado" value="no especificado" />
              </Picker>
              <Switch
                style={styles.switch}
                onValueChange={this.switchChildren}
                value={this.state.switchChildrenValue}
                thumbColor={this.state.childrenThumbcolor}
              />
            </View>
          </ScrollView>
        </View>

        <View style={styles.submit}>
          <TouchableOpacity style={styles.submitButton} onPress={this.goToResult}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const usersQuery = graphql(USERS_QUERY, {
  options: () => ({}), //  fake the user for now
  props: ({ data: { users } }) => ({
    users: users || [],
  }),
});

export default compose(
  usersQuery,
  withLoading,
)(Lifestyle);
