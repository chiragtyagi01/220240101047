
function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer>
            <p>&copy; {currentYear} URL Shortener. All Rights Reserved.</p>
        </footer>
    );
}

export default Footer;