import { Text, FlatList, TextInput, View } from "react-native/";
import { styles } from "./styles";
import {  MagnifyingGlass } from "phosphor-react-native";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { CardMovies} from "../../components/CardMovies";

interface Movie{
    id: number;
    title: string;
    poster_path: string;
    overview: string;
}
export function Home() {
    const[discoveryMovies, setDiscoveryMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [searchResultsMovies, setSearchResultsMovies] = useState<Movie[]>([]);
    const [noResult, setNoResult] = useState(false);
    
useEffect(() => {
    loadMoreData();
}, []);
    const loadMoreData = async () => {
        setLoading(true);
        const response = await api.get("/movie/popular", {
            params: {
                page,
            },
        });
        setDiscoveryMovies([...discoveryMovies, ...response.data.results]);
        setPage(page +1);
        setLoading(false); 
    };
const searchMovies = async (query: string) => {
    setLoading(true);
    const response = await api.get("/search/movie", {
        params: {
            query,
        }
});

if(response.data.results.length=== 0){
 setNoResult(true);
}else{
 setSearchResultsMovies(response.data.results);
}
setLoading(true);
};

 const handleSearch = (text: string) => {
    setSearch(text);
    if(text.length >2) {
   searchMovies(text);
    }else {
        setSearchResultsMovies([]);
    
    }
 };
 const movieData = search.length > 2 ? searchResultsMovies : discoveryMovies;
 return (
     <View style={styles.container}>
        <View style={styles.header}>
<Text style={styles.headerText}> Escolha sua preferência de filme para hoje:</Text>
<View style={styles.containerInput}>
<TextInput 
placeholderTextColor="#FFF"
placeholder="Buscar"
style={styles.input} r
value={search}
onChangeText={handleSearch}
/>
 <MagnifyingGlass color="#FFf" size={25} weight="light" />
  </View>
  </View> 
 
  <View>
    <FlatList 
    data={movieData}
    numColumns={3}
    renderItem={(item)=> <CardMovies data={item.item}/>}
    showsVerticalScrollIndicator={false}
    keyExtractor={(item)=> item.id.toString()}
    contentContainerStyle={{ 
        padding: 35,
        paddingBottom: 100,
    }}
    onEndReached={()=> loadMoreData()}
    onEndReachedThreshold={0.5}
    />

 {loading && <ActivityIndicator size={50} color="#0296e5"/>}
  </View>
  </View>
 );
}