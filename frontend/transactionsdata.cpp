#include "transactionsdata.h"
#include <QtGlobal>

TransactionsData::TransactionsData(QObject *parent)
	: QObject(parent)
{}

TransactionsData::~TransactionsData()
{}

QJsonArray TransactionsData::getTenTransactionsWithPageNumber(int page) const {
	QJsonArray tenTransactionsByPageNumber;

	int startIndex = (page - 1) * 10;
	int endIndex = qMin(startIndex + 10, transactions.size());

	for (int i = startIndex; i < endIndex; i++) {
		tenTransactionsByPageNumber.append(transactions.at(i));
	}
	return tenTransactionsByPageNumber;
}

int TransactionsData::getTotalTransactions() const
{
	return transactions.size();
}

int TransactionsData::getCurrentPage() const
{
	return currentPage;
}

void TransactionsData::setTransactions(QJsonArray transactionData) {
	transactions = transactionData;
}