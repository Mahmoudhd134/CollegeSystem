import './Home.scss'
import {useNavigate} from "react-router-dom";

const Home = () => {
    const navigator = useNavigate()
    return (
        <section className={'main'}>
            <div className="container">

                <div className="row justify-content-between mt-5">
                    <div className='col-12 col-md-4 text-center mb-3 mb-md-0'>
                        <img src={'/images/logo.jpg'} className={'logo'} draggable={false} alt=""/>
                        <h3>Quality Management System</h3>
                        <button className={'button2'}
                                onClick={e => navigator('/auth/login')}
                        >Get Started
                        </button>
                    </div>
                    <div className='col-12 col-md-8'>
                        <h5 className={'text-center'}>
                            :تم انشاء هذا النظام برعايه
                        </h5>
                        <p className={'text-center'}>
                            الاستاذ الدكتور / منصور حسن - رئيس الجامعة
                            <br/>
                            الاستاذ الدكتور / محمد قايد - عميد الكليه
                            <br/>
                            الاستاذ الدكتور / أحمد النجار - رئيس قسم علوم الحاسب
                            <br/>
                            الاستاذ الدكتور / نهى يحيى - المدرس بقسم علوم الحاسب
                            <br/>
                            البشمهندسة / هبه محمد - المعيده بقسم علوم الحاسب
                            <br/>
                            الاستاذ / هشام محمد - مدير الكليه
                            <br/>
                        </p>
                        <h6 className={'text-center'}>
                            :وعمل كل من طلاب الفرقه الثالثه قسم علوم الحاسب للعام الدراسى 2022- 2023
                        </h6>
                        <p className={'text-center'}>
                            روضه أحمد صلاح عبدالسلام
                            <br/>
                            ريهام محمد أحمد عبدالله
                            <br/>
                            زهور ضياءالدين طلعت وزيري
                            <br/>
                            زياد احمد عبيد بدوي
                            <br/>
                            سما عبد العظيم ادهم مبروك
                            <br/>
                            محمد احمد زكى عطيه
                            <br/>
                            محمد ايمن عبد الظاهر محمد
                            <br/>
                            محمود احمد ناصر محمود معوض
                            <br/>
                            مصطفى محمود عماره عبد الفتاح
                        </p>
                    </div>
                </div>
                <img src="/images/background.jpg" className={'bg-img'} alt=""/>
                {/*<img src="/images/colleg-logo.jpg" className={'logo'} draggable={false} alt=""/>*/}
                {/*<img src="/images/logo.jpeg" className={'site-logo'} draggable={false} alt=""/>*/}
                <div className="bg"></div>


            </div>
        </section>
    );
};

export default Home;