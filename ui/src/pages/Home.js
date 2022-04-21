import React, {useEffect, useState} from "preact/compat";
import "./HomeStyle.css";
import Icon from "../assets/Icon.png";
import Movies from "../../../moviebank-reverse.json";
import MoviesTitles from "../../../moviebank.json";
import searchEngine from "search-engine";
import {SyncLoader} from "react-spinners";
import axios from "axios";
export default function Home() {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [movieResult, setMovieResult] = useState([]);
    const [resultNotFound, setResultNotFound] = useState(false);

    useEffect(() => {
        Object.entries(Movies).forEach(([key, value]) => {
            setMovies(movies => [...movies, value]);
        });
    }, [])

    const onChange = (event) => {
        setSearch(event.target.value);
    }

    const onEnter = (event) => {
        if (event.key === 'Enter') {
            onSubmit(search);
        }
    }

    const onSubmit = (query) => {
        setSearch(""); // clear search bar
        setResultNotFound(false);
        let result = searchEngine(movies, query);
        if (result.length > 0) {
            if (result.length > 10) {
                result = result.slice(0, 10);
            }
            setSearchResult(result);
        } else {
            setSearchResult([]);
            setResultNotFound(true);
        }
    }

    const onClick = async (title) => {
        setIsLoading(true);
        setSearchResult([]);
        let id = MoviesTitles[title];
        await axios.post('https://gkl5vz6xgimbcgr2xyczzdmryu0ritur.lambda-url.ap-southeast-1.on.aws/', {
            "body": id.toString()
        }).then(res => {
            console.log(res);
        })
        setIsLoading(false);
    }

    return (
        <div className={"home-wrapper"}>
            <div>
                <img alt={"Out Of The Box icon image"} src={Icon} className={"home-icon"}/>
                <p className={"home-text"}>Recommends movies outside your interest</p>
                <br/>
                <input
                    className={"home-search"}
                    type={"text"}
                    value={search}
                    id={"movies-search"}
                    onKeyPress={onEnter}
                    onChange={onChange}
                    placeholder={"Search for movies..."}
                />
                {searchResult.map(elem => (
                    <p onClick={() => onClick(elem)} className={"home-result"}>{elem}</p>
                ))}
                {resultNotFound && <p style={{"color": "red"}} className={"home-text"}>Unable to find the result you're looking for!</p>}
                <SyncLoader color={"#ffffff"} loading={isLoading}/>
            </div>
        </div>
    );
}
