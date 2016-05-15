#include <QtWebEngineWidgets>
#include <QProcess>

int main(int argc, char **argv)
{
	#ifdef Q_OS_MAC
		QProcess mirror;
		mirror.start("/usr/local/bin/mirror", QStringList() << "-on");
	#endif

	QApplication app (argc, argv);

	QUrl url = (argc > 1) ? QUrl::fromUserInput(argv[1]) : QUrl("https://cheat.friedrich.rocks");
	QWebEngineView view;
	view.load(url);
	view.setWindowState(view.windowState() ^ Qt::WindowFullScreen);
	view.show();

	return app.exec();
}
