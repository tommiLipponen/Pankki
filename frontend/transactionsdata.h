#pragma once

#include <QObject>
#include <QJsonArray>

class TransactionsData  : public QObject
{
	Q_OBJECT

public:
	TransactionsData(QObject *parent = nullptr);
	~TransactionsData();

	QJsonArray getTenTransactionsWithPageNumber(int page) const;
	int getTotalTransactions() const;
	int getCurrentPage() const;
	void setCurrentPage(int page) { currentPage = page; }

	void setTransactions(QJsonArray transactionData);

private:
	QJsonArray transactions;
	int currentPage = 1;
};

