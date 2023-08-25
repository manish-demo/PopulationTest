import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const API_URL = "https://datausa.io/api/data?drilldowns=State&measures=Population&year=latest";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
       fetchData()
  }, []);

  useEffect(() => {
    if (filter) {
      const filtered = data
        .filter(state => state.State.toLowerCase().startsWith(filter.toLowerCase()))
        .sort((a, b) => b.State.localeCompare(a.State));
      setFilteredData(filtered);
    } else {
      const sortedByPopulation = [...data].sort((a, b) => a.Population - b.Population);
      setFilteredData(sortedByPopulation);
    }
  }, [filter, data]);

  const fetchData = () =>{
    fetch(API_URL)
    .then(response => response.json())
    .then(result => {
      setData(result.data);
      setFilteredData(result.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
  }


  const renderItem = ({ item }) => (
    <View  style={{borderColor:'green',borderWidth:1}}>
          <Text style = {styles.txtTyle}>{item.State} ({item.Population.toLocaleString()})</Text>
    </View>

  );

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.statusTxt} >Status: {loading ? "Loading..." : "Completed"}</Text>
      <Text style={styles.txtTyle}>Filter:</Text>
      <TextInput
        value={filter}
        onChangeText={setFilter}
        placeholder="Enter state..."
        style={styles.inputStyle}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item["ID State"]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  txtTyle:{
    padding:10,fontSize:16
  },
  inputStyle:{ borderWidth: 1, marginBottom: 20, padding: 5 },
  statusTxt:{fontSize:18,fontWeight:'bold',color:'green'}
})

export default App;
