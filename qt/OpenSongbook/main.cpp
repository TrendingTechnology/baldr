#include <QtWebEngineWidgets>
#include <QProcess>

int main(int argc, char **argv)
{
	#ifdef Q_OS_MAC
		QProcess mirror;
		mirror.start("/usr/local/bin/mirror", QStringList() << "-on");
	#endif

	QApplication app (argc, argv);

	#ifdef Q_OS_MAC
        QUrl url = QUrl("http://localhost/songbook/");
	#else
        QUrl url = QUrl("http://localhost:8080/songbook/");
	#endif

	QWebEngineView view;
	view.load(url);
	view.setWindowState(view.windowState() ^ Qt::WindowFullScreen);
	view.show();

	return app.exec();
}
