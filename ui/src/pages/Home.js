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
    const [buildingGenre, setBuildingGenre] = useState([]);
    const genres = ["Action", "Adventure", "Animation", "Children", "Comedy", "Crime", "Documentary", "Drama" , "Fantasy" ,"Film-Noir   Horror" ,"IMAX" , "Musical" , "Mystery", "Romance" , "Sci-Fi" , "Thriller" , "War", "Western"];

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
        setMovieResult([]);
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

    const onSubmitGenre = async () => {
        setIsLoading(true);
        setSearch("");
        setResultNotFound(false);
        setMovieResult([]);
        setSearchResult([]);
        let data = buildingGenre;
        setBuildingGenre([]);
        await axios({
            method: 'post',
            url: 'https://cs4225-epic-proxy.herokuapp.com/https://lcbk6dmod22l7zx6mxmoqjcrri0nupvl.lambda-url.ap-southeast-1.on.aws/',
            data: {
                genres: data
            },
            headers: {}
        }).then(res => {
            let result = res.data;
            if (result.length > 10) {
                result = result.slice(0, 10);
            }
            setSearchResult(result);
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }

    const onGenreClick = (genre) => {
        if (!buildingGenre.includes(genre)) {
            setBuildingGenre(buildingGenre => [...buildingGenre, genre]);
        }
    }

    const onClick = async (title) => {
        setIsLoading(true);
        setSearchResult([]);
        let id = MoviesTitles[title];
        if (!id) {
            setResultNotFound(true);
            setIsLoading(false);
            return;
        }
        await axios({
            method: 'post',
            url: 'https://cs4225-epic-proxy.herokuapp.com/https://gkl5vz6xgimbcgr2xyczzdmryu0ritur.lambda-url.ap-southeast-1.on.aws/',
            data: {
                body: id.toString()
            },
            headers: {}
        }).then(res => {
            let result = res.data.slice(res.data.length - 10, res.data.length);
            let output = [];
            result.forEach(elem => output.push(Movies[elem]));
            setMovieResult(output);
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
            setIsLoading(false);
        })
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
                    placeholder={"Search for a movie you like..."}
                />
                <p className={"home-text"}>OR</p>
                <div className={"genre-wrapper"}>
                    <p className={"home-movies"}>Search by Genre</p>
                    {genres.map(elem => (
                        <button className={"home-button"} onClick={() => onGenreClick(elem)}>{elem}</button>
                    ))}
                    {buildingGenre.length > 0 && <p className={"home-movies"}>Current genre selection:</p>}
                    {buildingGenre.map(elem => (
                        <span id={elem} className={"home-genres"}>{elem}</span>
                    ))}
                    <br/>
                    {buildingGenre.length > 0 && <button onClick={onSubmitGenre} className={"home-button-search"}>Search</button>}
                </div>
                <hr className={"home-divider"}></hr>
                {searchResult.length > 0 && <p className={"home-text"}>Here are your search results:</p>}
                {searchResult.map(elem => (
                    <p onClick={() => onClick(elem)} className={"home-result"}>{elem}</p>
                ))}
                {resultNotFound && <p style={{"color": "red"}} className={"home-text"}>Unable to find the result you're looking for!</p>}
                {movieResult.length > 0 && <p className="home-text">Here are some out of the box suggestions:</p>}
                {movieResult.map(elem => (
                    <p className={"home-movies"}>{elem}</p>
                ))}
                <SyncLoader color={"#ffffff"} loading={isLoading}/>
            </div>
        </div>
    );
}
