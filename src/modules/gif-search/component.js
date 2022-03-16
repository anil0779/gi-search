import React, { useCallback, useEffect, useRef, useState } from "react";
import { getGifs } from '../../api';
import './index.css';
import { InputBox, Button, Loader } from './style';
import useCheckMobileScreen from './../../hooks/useMobileCheck.hook';

const App = () => {

    const [searchInput, setSearchInput] = useState('');
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(100); // will be overwriiten from api
    const [offset, setOffset] = useState(0);
    const [lastElement, setLastElement] = useState(null);
    const isMobile = useCheckMobileScreen();

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
                const { offset, count } = res.data.pagination;
                setList(data =>  offset === count ? res.data.data : [...data, ...res.data.data]);
                setTotalCount(res.data.pagination.total_count);
            }
            setLoading(false)
        }
    }, [loading, offset, searchInput, totalCount]);

    const handleSubmit = useCallback(() => {
        if(searchInput) {
            getData();
        }  else {
            alert('Please enter search keyword');
        }
       
    }, [getData, searchInput]);

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
                <InputBox type='text' placeholder="Enter keywords" value={searchInput} onChange={updateSearchInput} />
                <Button type="button" value={'search'} onClick={handleSubmit} disabled={loading}/>
            </div>
             <List list={list}/>
            <div key='lastRef' ref={setLastElement}></div>
            {loading && <Loader><i style={{color: 'black'}} className="fa-5x fa-li fa fa-spinner fa-spin"></i></Loader>}
        </div>
    )
}

const List = ({ list = [] }) => {

    const isMobile = useCheckMobileScreen();

    if(list.length === 0) return <></>;

    return (
        <div className="list-gifs">
        {
            list.map((item, index) => {
                const { images } = item;
                const { fixed_height, fixed_width } = images;
                const { width, height, url} =  isMobile ? fixed_width : fixed_height;

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