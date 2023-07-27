import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Layout} from 'antd';
import './custom.css'
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Tag, Modal, message, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

const { Header, Content, Footer, Sider } = Layout;

const App = () => {

    const [visitors, setVisitors] = useState([])
    const [id, setId] = useState("");
    const [CompanyName, setCompanyName] = useState("");
    const [NameSurname, setNameSurname] = useState("");
    const [Adress, setAdress] = useState("");
    const [ArrivalTime, setArrivalTime] = useState(new Date());
    const [DepartureTime, setDepartureTime] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch("api/visitor/GetVisitors")
            .then(response => { return response.json() })
            .then(responseJson => { setVisitors(responseJson) })
        
    }, [])

    async function AddVisitors() {

        try {
            await axios.post("api/Visitor/AddVisitor", {
                CompanyName: CompanyName,
                NameSurname: NameSurname,
                Adress: Adress,
                ArrivalTime: ArrivalTime,
                DepartureTime: DepartureTime,
            });
            message.success('Ziyaretçi başarıyla eklendi!');
            setId("")
            setCompanyName("")
            setNameSurname("")
            setAdress("")
            setArrivalTime()
            setDepartureTime()

            fetch("api/visitor/GetVisitors")
                .then(response => { return response.json() })
                .then(responseJson => { setVisitors(responseJson) })

        } catch (error) {
            alert(error)
        }


    }

    async function DeleteVisitor(id) {
        await axios.delete("api/visitor/DeleteVisitor/" + id)
        setId("")
        setCompanyName("")
        setNameSurname("")
        setAdress("")
        setArrivalTime()
        setDepartureTime()

        fetch("api/visitor/GetVisitors")
            .then(response => { return response.json() })
            .then(responseJson => { setVisitors(responseJson) })
    }

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const confirm = (e) => {
        DeleteVisitor(e)
        message.success('Ziyaretçi başarıyla silindi!');
    };
    const cancel = (e) => {
        //message.error('Click on No');
    };

    const columns = [
        {
            title: 'ŞİRKET ADI',
            dataIndex: 'companyName',
            key: 'companyName',
            width: '30%',
            ...getColumnSearchProps('companyName'),
            sorter: (a, b) => ((a.companyName < b.companyName) ? 1 : (a.companyName > b.companyName ? -1 : 0)),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'ZİYARETÇİ',
            dataIndex: 'nameSurname',
            key: 'nameSurname',
            width: '30%',
            ...getColumnSearchProps('nameSurname'),
            sorter: (a, b) => ((a.nameSurname < b.nameSurname) ? 1 : (a.nameSurname > b.nameSurname ? -1 : 0)),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'ADRES',
            dataIndex: 'adress',
            key: 'adress',
            width: '30%',
            ...getColumnSearchProps('adress'),
            sorter: (a, b) => ((a.adress < b.adress) ? 1 : (a.adress > b.adress ? -1 : 0)),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'VARIŞ SAATİ',
            dataIndex: 'arrivalTime',
            key: 'arrivalTime',
            ...getColumnSearchProps('arrivalTime'),
            sorter: (a, b) => ((a.arrivalTime < b.arrivalTime) ? 1 : (a.arrivalTime > b.arrivalTime ? -1 : 0)),
            sortDirections: ['descend', 'ascend'],
            render: (_, record) => (
                <span>{new Date(record.arrivalTime).toLocaleString("tr-TR")}</span>
            ) 
        },
        {
            title: 'AYRILIŞ SAATİ',
            dataIndex: 'departureTime',
            key: 'departureTime',
            ...getColumnSearchProps('departureTime'),
            sorter: (a, b) => ((a.departureTime < b.departureTime) ? 1 : (a.departureTime > b.departureTime ? -1 : 0)),
            sortDirections: ['descend', 'ascend'],
            render: (_, record) => (
                <span>{new Date(record.departureTime).toLocaleString("tr-TR")}</span>
            )
        },
        {
            title: 'İŞLEM',
            key: 'islem',
            render: (_, record) => (
                  <Popconfirm
                    title="Ziyaretçiyi Sil"
                    description="Bu ziyaretçiyi silmek istediğinizden emin misiniz?"
                    onConfirm={() => confirm(record.id)}
                    onCancel={cancel}
                    okText="Evet"
                    cancelText="Hayır"
                    okType={"danger"}
                   >
                    <Button danger>Sil</Button>
                  </Popconfirm>
                
            ),
        },
    ];

    
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        console.log(CompanyName)
        AddVisitors();
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            <Header style={{ padding: 0 }} className="bg-slate-800 border-b-2 border-amber-50 text-center content-center py-auto">
                    <h1 className="text-2xl font-bold text-white pt-3" > ZiYARET LİSTESİ </h1>
             </Header>
            <div className="w-9/12 mx-auto mt-5" >
                <Button onClick={showModal} className="mb-2">
                    Ziyaretçi Ekle
                </Button>
                <Table columns={columns} dataSource={visitors} />

            </div>
           
            <Modal title="Ziyaret Kartı" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okType={"default"}>
                <div className="row">
                    <form>
                        <div className="form-group">
                            <input type="text" className="form-control" id="id" hidden value={id}
                                onChange={(event) => {
                                    setId(event.target.value)
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Şirket Adı</label>
                            <input type="text" className="form-control" id="CompanyName" value={CompanyName}
                                onChange={(event) => {
                                    setCompanyName(event.target.value)
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Ziyaretçi</label>
                            <input type="text" className="form-control" id="NameSurname" value={NameSurname}
                                onChange={(event) => {
                                    setNameSurname(event.target.value)
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Adres</label>
                            <input type="text" className="form-control" id="Adress" value={Adress}
                                onChange={(event) => {
                                    setAdress(event.target.value)
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Varış Saati</label>
                            <DateTimePicker onChange={setArrivalTime} value={ArrivalTime} id="ArrivalTime" />
                            
                        </div>
                        <div className="form-group">
                            <label>Ayrılış Saati</label>
                            <DateTimePicker onChange={setDepartureTime} value={DepartureTime} id="DepartureTime" />
                            
                        </div>
                    </form>
                </div>
            </Modal>
            
        </>
)

}

export default App;