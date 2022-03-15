import React, { useCallback, useEffect, useRef, useState } from "react";
import { getGifs } from '../../api';
import './index.css';

const App = () => {

    const [searchInput, setSearchInput] = useState('');
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(100); // will be overwriiten from api
    const [offset, setOffset] = useState(0);
    const [lastElement, setLastElement] = useState(null);

    const observer = useRef(
        new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    setOffset(offset => offset + 50); // TODO: take from api
                }
            })
    );

    const updateSearchInput = useCallback((evt) => {
        setSearchInput(evt.target.value);
    }, []);

    const getData = useCallback(async () => {
        if (searchInput && offset < totalCount && !loading) {
            setLoading(true);
            const res = await getGifs(searchInput, offset);
            if (res.data.data.length > 0) {
                setList(data => [...data, ...res.data.data]);
                setTotalCount(res.data.pagination.total_count);
            }
            setLoading(false)
        }
    }, [loading, offset, searchInput, totalCount]);

    const handleSubmit = useCallback(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        getData();
    }, [offset])

    useEffect(() => {
        const currentElement = lastElement;
        const currentObserver = observer.current;

        if (currentElement) {
            currentObserver.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                currentObserver.unobserve(currentElement);
            }
        };
    }, [lastElement]);

    return (
        <div className="gif-search-container">
            <div className="search-box">
                <input type='text' value={searchInput} onChange={updateSearchInput} />
                <input type="button" value={'search'} onClick={handleSubmit} />
            </div>
             <List list={list}/>
            <div key='lastRef' ref={setLastElement}></div>
            {loading && <div>...loading</div>}
        </div>
    )
}

const List = ({ list = [] }) => {

    if(list.length === 0) return <></>;

    return (
        <div className="list-gifs">
        {
            list.map((item, index) => {
                const { images } = item;
                const { fixed_height } = images;
                const { width, height, url} = fixed_height;

                return (
                    <div key={item.id + index}>
                        <div className="gif">
                            <img src={url} alt='url' width={width} height={height} />
                        </div>
                    </div>
                )
            })
        }
        </div>
    )
}

export default App;