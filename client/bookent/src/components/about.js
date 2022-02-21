import NavBar from './favorites/navBar'
import Footer from './home/footer'
function About() {
    return (
        <>
            <NavBar />
            <center style={{ height:'100%', margin: '8% 20vw', overflow:'hidden'}}>
                <h2 style={{ fontSize: 3 + 'vmin' }}>
                    BOOKENT is a web application that aims to simplify the process of book loan between
                    readers who prefer to own the printed copy of books.<br /><br />
                </h2>
                <h4 style={{ fontSize: 2.5 + 'vmin' }}>
                    Reading books is very important in our life since it keeps the brain alive and healthy.
                    However, recently in our society, it has received less attention. One of the major reasons
                    is the invention of smartphones and other Internet-based devices which makes books easily
                    available. However, many people still prefer physical books to digital ones since the former
                    cause more concentration and fewer headaches. We developed an application to encourage
                    people to revive the reading habit using physical books. Our application simplifies the
                    process of reading physical books. The application is really very helpful for the reader as
                    they can swap books instead of buying and wasting money. <br /><br />
                </h4>

                <h4 style={{ fontSize: 2.5 + 'vmin' }}>
                    The main intention of this project is to make books swapping easier and more active for all
                    ages in our society. The idea is a simple, bring books and swap them at a local community.
                    It would create a great way for people to meet and share reviews and pass on their reads to
                    a new audience. As a result, the book readers will be increased, and their knowledge can
                    be shared. By using an application, the process finding and exchanging books will be much
                    more flexible and simpler.
                </h4>

                <h2 style={{ fontSize: 3 + 'vmin' }}>
                <br />
                    We aim to implement our application in a real world and evaluate its
                    usability and efficiency by a group of participants.
                </h2>
            </center>
            <Footer />
        </>
    );
}

export default About;