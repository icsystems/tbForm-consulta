#!/usr/bin/env python

"""
 proxy.py based on
 http://code.activestate.com/recipes/267197-urllib2-for-actions-depending-on-http-response-cod/
 
 Author: Fernando.Ferreira@icsystems.com.br
 Date:   March 21th, 2010
"""

import cgitb; cgitb.enable()
print 'Content-type: text/html'
print


import urllib2
from urlparse import urlparse
from HTMLParser import HTMLParser

class Parser(HTMLParser):
	def __init__(self, content):
		self.filteredHTML = ''
		self.readTag = False
		self.undesiredTags = ['span','link','script','title','html','head','body','br']
		HTMLParser.__init__(self)
		self.feed(content)
	def handle_starttag(self, tag, attrs):
		if not tag in self.undesiredTags:
			self.readTag = True
			self.filteredHTML += '<%s'%tag
			for tAttr in attrs:
				if tAttr[0] == 'colspan' and 'title' not in tAttr[1]:
					self.filteredHTML += ' %s="%s"'%tAttr
				if tAttr[0] == 'class' and 'title3' in tAttr[1]:
					self.filteredHTML += ' %s="%s"'%('class', 'label')
			self.filteredHTML += '>'

		else:
			self.readTag = False
	def handle_data(self,data):
		if self.readTag:
			self.filteredHTML += data
	def handle_endtag(self, tag):
		if not tag in self.undesiredTags:
			self.filteredHTML += '</%s>'%tag
	def getFilteredHTML(self):
		return self.filteredHTML

class HTTPinger:
	def getContent(self, url, webuser, webpass):
		scheme, domain, path, x1, x2, x3 = urlparse(url)
		finder = HTTPRealmFinder(url)
		realm = finder.get()
		handler = urllib2.HTTPBasicAuthHandler()
		handler.add_password(realm, domain, webuser, webpass)
		opener = urllib2.build_opener(handler)
		urllib2.install_opener(opener)
		try:
			f = urllib2.urlopen(url)
		except urllib2.HTTPError, e:
			if e.code == 401:
				return 'not authorized'
			elif e.code == 404:
				return 'not found'
			elif e.code == 503:
				return 'service unavailable'
			else:
				return 'unknown error: '
		else:
			content  = f.read()
			encoding = 'iso-8859-1'
			#ucontent = unicode(content, encoding)
			ucontent = content
			return ucontent

class HTTPRealmFinderHandler(urllib2.HTTPBasicAuthHandler):
	def http_error_401(self, req, fp, code, msg, headers):
		realm_string = headers['www-authenticate']
		q1 = realm_string.find('"')
		q2 = realm_string.find('"', q1+1)
		realm = realm_string[q1+1:q2]
		self.realm = realm

class HTTPRealmFinder:
	def __init__(self, url):
		self.url = url
		scheme, domain, path, x1, x2, x3 = urlparse(url)
		handler = HTTPRealmFinderHandler()
		handler.add_password(None, domain, 'foo', 'bar')
		self.handler = handler
		opener = urllib2.build_opener(handler)
		urllib2.install_opener(opener)

	def ping(self, url):
		try:
			urllib2.urlopen(url)
		except urllib2.HTTPError, e:
			pass

	def get(self):
		self.ping(self.url)
		try:
			realm = self.handler.realm
		except AttributeError:
			realm = None
		return realm

	def prt(self):
		print self.get()

class htmlCleaner:
	def __init__(self, content):
		self.content = content
	def parseContent(self):
		return Parser(self.content)
	def getCleanHTML(self):
		p= self.parseContent()
		return p.getFilteredHTML()

if __name__ == '__main__':
	pinger = HTTPinger()
	content = pinger.getContent('https://www.gruyere.lps.ufrj.br/~gustavo/verLadoExames.cgi?uid=medico&pid=831', 'medico', 'medico')
	hc = htmlCleaner(content)
	print hc.getCleanHTML()

