#include <QApplication>
#include <QTextEdit>

int main(int argc, char **argv)
{
 QApplication app (argc, argv);

 QTextEdit *txt = new QTextEdit();
  txt->setText("Fullscreen!");
  txt->setWindowState(txt->windowState() ^ Qt::WindowFullScreen);

  txt->show();

 return app.exec();
}
