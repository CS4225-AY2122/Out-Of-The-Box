import React, {useState} from "preact/compat";
import "./HomeStyle.css";
import Icon from "../assets/Icon.png";

export default function Home() {
    const [search, setSearch] = useState("");

    const onChange = (event) => {
        setSearch(event.target.value);
    }

    const onEnter = (event) => {
        if (event.key === 'Enter') {
            onSubmit(search);
        }
    }

    const onSubmit = (query) => {
        setSearch("");
        console.log(query)
    }

    return (
        <div className={"home-wrapper"}>
            <div>
                <img alt={"Out Of The Box icon image"} src={Icon} className={"home-icon"}/>
                <p className={"home-text"}>Recommends movies that you WON'T like</p>
                <br/>
                <input
                    className={"home-search"}
                    type={"text"}
                    value={search}
                    id={"header-search"}
                    onKeyPress={onEnter}
                    onChange={onChange}
                    placeholder={"Search for movies..."}
                />
            </div>
        </div>
    );
}
